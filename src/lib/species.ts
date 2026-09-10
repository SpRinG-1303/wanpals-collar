import dogAsset from "@/assets/species-dog.jpg.asset.json";

const dogImg = dogAsset.url;

/* Dog profile data shared across the owner experience. */

export type SpeciesId = "dog";

export type Species = {
  id: SpeciesId;
  label: string;      // "Cow"
  plural: string;     // "Cows"
  emoji: string;
  image: string;
  namePlaceholder: string;
  tempRange: string;
  breeds: string[];
  facts: string[];
};

export const SPECIES: Species[] = [
  {
    id: "dog",
    label: "Dog",
    plural: "Dogs",
    emoji: "🐕",
    image: dogImg,
    namePlaceholder: "e.g. Bruno",
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
];

export function getSpecies(_id?: string | null): Species {
  return SPECIES[0];
}
