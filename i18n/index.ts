import * as Localization from "expo-localization";
import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next } from "react-i18next";

import { storage, STORAGE_KEYS } from "@/lib/storage";
import { I18nManager } from "react-native";
import translationAr from "./ar-AR/translation.json";
import translationEn from "./en-US/translation.json";
import translationFr from "./fr-FR/translation.json";
console.log("location", Localization.getLocales()[0].languageCode);
const resources = {
  "fr-FR": { translation: translationFr },
  en: { translation: translationEn },
  "ar-AR": { translation: translationAr },
};
const languageDetector: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  init: () => {}, // Required by i18next, but can be a no-op
  async: true, // To flag the detection as asynchronous
  detect: async (): Promise<string | undefined> => {
    const storedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
    console.log("storedLanguage", storedLanguage);
    const deviceLanguage =
      storedLanguage || Localization.getLocales()[0].languageCode;
    console.log(
      "device language",
      deviceLanguage,
      "location",
      Localization.getLocales()[0]
    );
    return deviceLanguage || "en";
  },
  cacheUserLanguage: () => {},
};
const initI18n = async () => {
  let savedLanguage = storage.getString(STORAGE_KEYS.LANGUAGE);
  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode || "en";
  }

  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      compatibilityJSON: "v4",
      resources,

      lng: savedLanguage,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
    });
};

initI18n();
type LanguageType = keyof typeof resources;
const changeLanguage = async (language: LanguageType) => {
  if (i18n.language === language) {
    return;
  }
  console.log("Changing language to:", language);
  storage.set(STORAGE_KEYS.LANGUAGE, language);
  await i18n.changeLanguage(language);
  const isRTL = language === "ar-AR";
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
};

export { changeLanguage, i18n, LanguageType };
