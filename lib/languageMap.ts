export interface LanguageConfig {
  label: string;
  code: string;
  market: string;
  genreSeeds: string[];
  searchHint: string; // appended to search queries to bias results
}

export const LANGUAGES: LanguageConfig[] = [
  {
    label: "English",
    code: "en",
    market: "US",
    genreSeeds: ["pop", "rock", "hip-hop", "indie"],
    searchHint: "",
  },
  {
    label: "Spanish",
    code: "es",
    market: "ES",
    genreSeeds: ["latin", "reggaeton", "salsa", "latin-pop"],
    searchHint: "spanish",
  },
  {
    label: "French",
    code: "fr",
    market: "FR",
    genreSeeds: ["french", "chanson-francaise", "pop"],
    searchHint: "french",
  },
  {
    label: "Portuguese",
    code: "pt",
    market: "BR",
    genreSeeds: ["brazil", "bossanova", "axe", "pagode", "sertanejo"],
    searchHint: "portuguese",
  },
  {
    label: "German",
    code: "de",
    market: "DE",
    genreSeeds: ["german", "schlager", "pop"],
    searchHint: "german",
  },
  {
    label: "Italian",
    code: "it",
    market: "IT",
    genreSeeds: ["italian", "pop"],
    searchHint: "italian",
  },
  {
    label: "Japanese",
    code: "ja",
    market: "JP",
    genreSeeds: ["j-pop", "j-rock", "j-idol", "anime"],
    searchHint: "japanese",
  },
  {
    label: "Korean",
    code: "ko",
    market: "KR",
    genreSeeds: ["k-pop", "k-rock", "k-rap"],
    searchHint: "korean",
  },
  {
    label: "Chinese (Mandarin)",
    code: "zh",
    market: "TW",
    genreSeeds: ["mandopop", "c-pop"],
    searchHint: "mandarin",
  },
  {
    label: "Hindi",
    code: "hi",
    market: "IN",
    genreSeeds: ["indian", "desi", "bollywood"],
    searchHint: "hindi",
  },
  {
    label: "Arabic",
    code: "ar",
    market: "SA",
    genreSeeds: ["turkish", "pop"],
    searchHint: "arabic",
  },
  {
    label: "Turkish",
    code: "tr",
    market: "TR",
    genreSeeds: ["turkish", "pop"],
    searchHint: "turkish",
  },
  {
    label: "Russian",
    code: "ru",
    market: "RU",
    genreSeeds: ["pop", "rock"],
    searchHint: "russian",
  },
  {
    label: "Swedish",
    code: "sv",
    market: "SE",
    genreSeeds: ["swedish", "scandinavian-pop", "nordic"],
    searchHint: "swedish",
  },
  {
    label: "Dutch",
    code: "nl",
    market: "NL",
    genreSeeds: ["dutch", "pop"],
    searchHint: "dutch",
  },
];

export function getLanguageByCode(code: string): LanguageConfig | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
