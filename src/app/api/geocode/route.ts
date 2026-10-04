import { haversine } from "@/lib/geo";

const CENTER = { lat: 35.0116, lng: 135.7681 };

export async function GET(req: Request) {
  const raw = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!raw) return Response.json({ error: "Type a place." }, { status: 400 });
  const search = /kyoto|uji|京都|宇治/i.test(raw) ? raw : `${raw}, Kyoto`;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(search)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FamilyWalk/1.0 (Kyoto family walking day)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return Response.json({ error: "The map search did not answer." }, { status: 502 });
    const data = (await res.json()) as { lat: string; lon: string; name?: string }[];
    const hit = data[0];
    if (!hit) return Response.json({ error: "I couldn't find that in Kyoto." }, { status: 404 });
    const lat = Number(hit.lat);
    const lng = Number(hit.lon);
    if (haversine(CENTER, { lat, lng }) > 30000) {
      return Response.json({ error: "That place looks too far from Kyoto for this walk." }, { status: 422 });
    }
    const typed = raw.replace(/,?\s*(kyoto|japan)$/i, "").trim();
    return Response.json({ name: typed || hit.name || raw, lat, lng });
  } catch {
    return Response.json({ error: "The map search did not answer." }, { status: 502 });
  }
}
