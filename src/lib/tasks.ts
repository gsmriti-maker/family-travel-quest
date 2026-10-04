import type { McTask, WriteTask } from "./types";

function distractors(name: string): [string, string] {
  const lower = name.toLowerCase();
  const options = ["A swimming pool", "A train platform", "A football goal", "A bakery counter"];
  const usable = options.filter((option) => {
    const word = option.split(" ").pop()?.toLowerCase() ?? "";
    return word.length > 0 && !lower.includes(word);
  });
  return [usable[0] ?? "A blank wall", usable[1] ?? "Only the sky"];
}

export function genericTaskPair(name: string): {
  young: [McTask, McTask];
  older: [WriteTask, WriteTask];
} {
  const [wrongA, wrongB] = distractors(name);
  return {
    young: [
      {
        task: `Find ${name}. Take a photo that shows it, not just the ground.`,
        question: "What were you asked to find?",
        choices: [name, wrongA, wrongB],
        correctIndex: 0,
      },
      {
        task: `At ${name}, find a door, a gate, or the front. Photo that.`,
        question: "What is in the middle of your photo?",
        choices: ["The front of the place, or a way in", "Only the sky", "A plate of food"],
        correctIndex: 0,
      },
    ],
    older: [
      {
        task: `Walk up to ${name} and around it if that is safe. Photo a part a hurried person would miss.`,
        question: "Write one sentence on what that part seems to be for. If you can't tell, say so.",
      },
      {
        task: `Step back until ${name} fits in the photo, with some of the street or path beside it.`,
        question: "Write what is beside it, and whether that street or path is busy or quiet.",
      },
    ],
  };
}

export function cautiousCopy(name: string, hint?: string): {
  scene: string;
  history: string;
  reflection: string;
} {
  const kind = hint ? ` The map calls it a ${hint}.` : "";
  return {
    scene: `${name} is on the map as a place to visit. I have not checked it in person. Look at what is actually here, and rewrite this before you treat it as fact.`,
    history: `I am not stating a date or a plaque for ${name}.${kind} If a sign tells you more, type that in yourself.`,
    reflection: "What is the one thing here you would tell someone who could not come?",
  };
}
