import translationEn from "./en-US/translation.json";

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? //@ts-ignore
          `${K}` | `${K}.${DeepKeys<T[K]>}`
        : //@ts-ignore
          `${K}`;
    }[keyof T]
  : never;

export type TranslationType = typeof translationEn;
export type TranslationKeys = DeepKeys<TranslationType>;
