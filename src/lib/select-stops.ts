import { estimateMinutes, haversine, maxDiameter, pathLength, type LatLng } from "./geo";

export type Point = LatLng & { id: string };

function scoreTime(minutes: number): number {
  let score = Math.abs(minutes - 85);
  if (minutes < 60) score += (60 - minutes) * 4;
  if (minutes > 120) score += (minutes - 120) * 4;
  return score;
}

function scoreCluster(minutes: number, diameter: number, count: number): number {
  // Few stops can spread out, as long as the walk stays about an hour or two.
  // More stops should sit in a smaller patch of the city.
  const tightWeight = count <= 3 ? -0.0016 : count === 4 ? 0.0008 : count <= 6 ? 0.005 : 0.012;
  return scoreTime(minutes) + diameter * tightWeight;
}

function nearestNeighbor<T extends Point>(pool: T[], start: T): T[] {
  const left = pool.filter((p) => p.id !== start.id);
  const route: T[] = [start];
  while (left.length) {
    const last = route[route.length - 1];
    let bestIndex = 0;
    let best = Infinity;
    for (let i = 0; i < left.length; i++) {
      const d = haversine(last, left[i]);
      if (d < best) {
        best = d;
        bestIndex = i;
      }
    }
    route.push(left.splice(bestIndex, 1)[0]);
  }
  return route;
}

function twoOpt<T extends Point>(route: T[]): T[] {
  let current = route.slice();
  let improved = true;
  let guard = 0;
  while (improved && guard < 30) {
    improved = false;
    guard += 1;
    for (let i = 0; i < current.length - 2; i++) {
      for (let k = i + 2; k < current.length; k++) {
        const next = current.slice();
        const reversed = next.slice(i + 1, k + 1).reverse();
        next.splice(i + 1, reversed.length, ...reversed);
        if (pathLength(next) + 1 < pathLength(current)) {
          current = next;
          improved = true;
        }
      }
    }
  }
  return current;
}

export function orderForTime<T extends Point>(pool: T[]): T[] {
  if (pool.length <= 2) return pool.slice();
  let best = nearestNeighbor(pool, pool[0]);
  let bestScore = scoreTime(estimateMinutes(pathLength(best)));
  for (const start of pool) {
    const route = nearestNeighbor(pool, start);
    const score = scoreTime(estimateMinutes(pathLength(route)));
    if (score < bestScore) {
      best = route;
      bestScore = score;
    }
  }
  const minutes = estimateMinutes(pathLength(best));
  if (minutes > 120) {
    const shorter = twoOpt(best);
    if (scoreTime(estimateMinutes(pathLength(shorter))) < bestScore) return shorter;
  }
  return best;
}

function grow<T extends Point>(pool: T[], seed: T, count: number, spacing: number): T[] {
  const chosen: T[] = [seed];
  const cap = spacing * (count <= 4 ? count : Math.sqrt(count) * 1.2);
  while (chosen.length < count) {
    let best: T | null = null;
    let bestScore = Infinity;
    for (const point of pool) {
      if (chosen.some((c) => c.id === point.id)) continue;
      const fromSeed = haversine(seed, point);
      if (fromSeed > cap) continue;
      const nearest = Math.min(...chosen.map((c) => haversine(c, point)));
      const score = Math.abs(nearest - spacing) + fromSeed * 0.04;
      if (score < bestScore) {
        bestScore = score;
        best = point;
      }
    }
    if (!best) {
      let nearest: T | null = null;
      let dist = Infinity;
      for (const point of pool) {
        if (chosen.some((c) => c.id === point.id)) continue;
        const d = Math.min(...chosen.map((c) => haversine(c, point)));
        if (d < dist) {
          dist = d;
          nearest = point;
        }
      }
      if (!nearest) break;
      chosen.push(nearest);
    } else {
      chosen.push(best);
    }
  }
  return chosen;
}

/**
 * Pick `count` stops whose natural walk is about 1–2 hours.
 * More stops are chosen from a tighter area, not by stretching the day.
 */
export function clusterOptions<T extends Point>(pool: T[], count: number): T[][] {
  const n = Math.min(Math.max(count, 1), pool.length);
  if (pool.length === 0 || n === 0) return [];
  if (pool.length <= n) return [orderForTime(pool)];

  const seen = new Set<string>();
  const subsets: T[][] = [];
  const add = (items: T[]) => {
    if (items.length !== n) return;
    const key = items
      .map((item) => item.id)
      .sort()
      .join("|");
    if (seen.has(key)) return;
    seen.add(key);
    subsets.push(items);
  };

  for (const seed of pool) {
    const nearest = [...pool].sort((a, b) => haversine(seed, a) - haversine(seed, b));
    add(nearest.slice(0, n));
  }

  for (const spacing of [350, 550, 800, 1100, 1500, 2100, 2800]) {
    for (const seed of pool) add(grow(pool, seed, n, spacing));
  }

  const ranked = subsets
    .map((subset) => {
      const ordered = orderForTime(subset);
      const minutes = estimateMinutes(pathLength(ordered));
      const diameter = maxDiameter(ordered);
      return { ordered, score: scoreCluster(minutes, diameter, n) };
    })
    .sort((a, b) => a.score - b.score);

  return ranked.slice(0, 6).map((item) => item.ordered);
}
