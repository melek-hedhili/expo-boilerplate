import translationEn from "./en-US/translation.json";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T & (string | number)]: `${K}` | `${K}.${DeepKeys<T[K]>}`;
    }[keyof T & (string | number)]
  : never;

export type TranslationType = typeof translationEn;
export type TranslationKeys = DeepKeys<TranslationType>;
