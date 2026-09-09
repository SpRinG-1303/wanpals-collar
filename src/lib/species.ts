/* Species catalogue — the whole owner experience adapts to the pet type. */

export type SpeciesId = "cow" | "buffalo" | "goat" | "sheep" | "dog" | "cat";

export type Species = {
  id: SpeciesId;
  label: string;      // "Cow"
  plural: string;     // "Cows"
  emoji: string;
  namePlaceholder: string;
  soundLabel: string;   // sensor naming, e.g. "MooSense AI"
  soundSub: string;
  tempRange: string;
  breeds: string[];
  facts: string[];
};

export const SPECIES: Species[] = [
  {
    id: "cow",
    label: "Cow",
    plural: "Cows",
    emoji: "🐄",
    namePlaceholder: "e.g. Gauri",
    soundLabel: "MooSense AI",
    soundSub: "Moo Analysis",
    tempRange: "38.0–39.3°C",
    breeds: ["Gir", "Sahiwal", "Red Sindhi", "Tharparkar", "Rathi", "Kankrej", "Holstein Friesian", "Jersey", "Mixed"],
    facts: [
      "Cows have almost 360° panoramic vision and can sense danger from all directions.",
      "The Gir cow of Gujarat is one of India's hardiest breeds, prized for A2 milk.",
      "A cow's normal body temperature is 38.0–39.3°C.",
      "Cows form close friendships and get stressed when separated from their herd mates.",
      "A healthy cow chews her cud for around 8 hours a day.",
    ],
  },
  {
    id: "buffalo",
    label: "Buffalo",
    plural: "Buffaloes",
    emoji: "🐃",
    namePlaceholder: "e.g. Kali",
    soundLabel: "CallSense AI",
    soundSub: "Call Analysis",
    tempRange: "37.5–39.0°C",
    breeds: ["Murrah", "Jaffarabadi", "Mehsana", "Nili-Ravi", "Surti", "Bhadawari", "Mixed"],
    facts: [
      "Murrah buffaloes give some of the richest milk in the world — over 7% fat.",
      "Buffaloes wallow in mud to cool down; they have far fewer sweat glands than cattle.",
      "A buffalo's normal body temperature is 37.5–39.0°C.",
      "Buffaloes recognise their handlers by voice and routine.",
      "India is home to more than half of the world's buffalo population.",
    ],
  },
  {
    id: "goat",
    label: "Goat",
    plural: "Goats",
    emoji: "🐐",
    namePlaceholder: "e.g. Chotu",
    soundLabel: "BleatSense AI",
    soundSub: "Bleat Analysis",
    tempRange: "38.5–39.7°C",
    breeds: ["Jamnapari", "Sirohi", "Beetal", "Barbari", "Osmanabadi", "Black Bengal", "Malabari", "Mixed"],
    facts: [
      "Goats have rectangular pupils, giving them a very wide field of view.",
      "The Jamnapari goat of Uttar Pradesh is known as the 'Pride of India'.",
      "A goat's normal body temperature is 38.5–39.7°C.",
      "Goats call to each other in accents that change with their herd.",
      "Goats are excellent climbers and love raised platforms in their shed.",
    ],
  },
  {
    id: "sheep",
    label: "Sheep",
    plural: "Sheep",
    emoji: "🐑",
    namePlaceholder: "e.g. Moti",
    soundLabel: "BleatSense AI",
    soundSub: "Bleat Analysis",
    tempRange: "38.3–39.9°C",
    breeds: ["Deccani", "Nellore", "Marwari", "Mandya", "Chokla", "Bannur", "Garole", "Mixed"],
    facts: [
      "Sheep can remember the faces of around 50 other sheep for years.",
      "Marwari sheep of Rajasthan thrive in dry desert grazing conditions.",
      "A sheep's normal body temperature is 38.3–39.9°C.",
      "Sheep have a strong flocking instinct and get anxious when alone.",
      "Regular shearing prevents heat stress and skin infections.",
    ],
  },
  {
    id: "dog",
    label: "Dog",
    plural: "Dogs",
    emoji: "🐕",
    namePlaceholder: "e.g. Bruno",
    soundLabel: "BarkSense AI",
    soundSub: "Bark Analysis",
    tempRange: "38.3–39.2°C",
    breeds: ["Indian Pariah Dog", "Labrador Retriever", "Golden Retriever", "Indian Spitz", "Pomeranian", "Shih Tzu", "Beagle", "Rajapalayam", "German Shepherd", "Mixed"],
    facts: [
      "Dogs have unique nose prints, just like human fingerprints.",
      "The Indian Pariah Dog is one of the world's oldest naturally evolved breeds.",
      "A dog's normal body temperature is 38.3–39.2°C, higher than humans.",
      "Dogs can distinguish around 10,000 different scents.",
      "Dogs dream too — they twitch during REM sleep.",
    ],
  },
  {
    id: "cat",
    label: "Cat",
    plural: "Cats",
    emoji: "🐈",
    namePlaceholder: "e.g. Mishti",
    soundLabel: "MeowSense AI",
    soundSub: "Meow Analysis",
    tempRange: "38.1–39.2°C",
    breeds: ["Indian Billi (Domestic Shorthair)", "Persian", "Siamese", "Bombay", "Himalayan", "Maine Coon", "Mixed"],
    facts: [
      "Cats meow mainly to talk to humans, rarely to other cats.",
      "A cat's normal body temperature is 38.1–39.2°C.",
      "Cats spend nearly 70% of their life sleeping.",
      "A cat's purr vibrates at a frequency that helps heal bone and tissue.",
      "Whiskers help cats judge whether they can fit through a gap.",
    ],
  },
];

export function getSpecies(id: string | null | undefined): Species {
  return SPECIES.find((s) => s.id === id) ?? SPECIES[4];
}
