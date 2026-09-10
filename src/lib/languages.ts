/* Language catalogue — 43 languages supported by Pawsitive Diagnostics. */

export const INDIAN_LANGUAGES = [
  "Hindi", "English", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu",
  "Gujarati", "Kannada", "Malayalam", "Odia", "Punjabi", "Assamese",
  "Maithili", "Sanskrit", "Konkani", "Kashmiri", "Sindhi", "Nepali",
  "Manipuri (Meitei)", "Bodo", "Dogri",
];

export const GLOBAL_LANGUAGES = [
  "Mandarin Chinese", "Spanish", "Arabic", "French", "Portuguese",
  "Russian", "German", "Japanese", "Korean", "Indonesian", "Turkish",
  "Italian", "Vietnamese", "Thai", "Dutch", "Persian (Farsi)", "Polish",
  "Swahili", "Filipino/Tagalog",
];

export const ALL_LANGUAGES = [...INDIAN_LANGUAGES, ...GLOBAL_LANGUAGES.filter((l) => l !== "English")];
export const LANGUAGE_COUNT = ALL_LANGUAGES.length; // 43

const KEY = "momentum-display-lang";

export function getDisplayLanguage(): string {
  if (typeof window === "undefined") return "English";
  try {
    return localStorage.getItem(KEY) || "English";
  } catch {
    return "English";
  }
}

export function setDisplayLanguage(lang: string) {
  try {
    localStorage.setItem(KEY, lang);
  } catch {}
}
