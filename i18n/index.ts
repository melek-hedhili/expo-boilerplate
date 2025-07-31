import * as Localization from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";

import { storage, STORAGE_KEYS } from "@/lib/storage";
import translationAr from "./ar-AR/translation.json";
import translationEn from "./en-US/translation.json";
import translationFr from "./fr-FR/translation.json";

// Supported languages mapping
const SUPPORTED_LANGUAGES = {
  en: "en",
  "en-US": "en",
  fr: "fr-FR",
  "fr-FR": "fr-FR",
  ar: "ar-AR",
  "ar-AR": "ar-AR",
} as const;

const resources = {
  en: { translation: translationEn },
  "fr-FR": { translation: translationFr },
  "ar-AR": { translation: translationAr },
};

type LanguageType = keyof typeof resources;

// Simplified language detector
const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  init: () => {},
  async: true,
  detect: async (): Promise<string> => {
    const storedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
    if (
      storedLanguage &&
      SUPPORTED_LANGUAGES[storedLanguage as keyof typeof SUPPORTED_LANGUAGES]
    ) {
      return SUPPORTED_LANGUAGES[
        storedLanguage as keyof typeof SUPPORTED_LANGUAGES
      ];
    }

    const deviceLanguage = Localization.getLocales()[0].languageCode;
    return (
      SUPPORTED_LANGUAGES[deviceLanguage as keyof typeof SUPPORTED_LANGUAGES] ||
      "en"
    );
  },
  cacheUserLanguage: () => {},
};

// Initialize i18n
const initI18n = async () => {
  const savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
  const initialLanguage =
    savedLanguage || Localization.getLocales()[0].languageCode || "en";
  const mappedLanguage =
    SUPPORTED_LANGUAGES[initialLanguage as keyof typeof SUPPORTED_LANGUAGES] ||
    "en";

  // Save the detected language if not already saved
  if (!savedLanguage) {
    storage.set(STORAGE_KEYS.LANGUAGE, mappedLanguage);
  }

  await i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v4",
      resources,
      lng: mappedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();

// Optimized language change function
const changeLanguage = async (language: LanguageType) => {
  if (i18n.language === language) return;

  console.log("Changing language to:", language);
  storage.set(STORAGE_KEYS.LANGUAGE, language);
  await i18n.changeLanguage(language);

  // Handle RTL for Arabic
  const isRTL = language === "ar-AR";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

export { changeLanguage, i18n, LanguageType };
