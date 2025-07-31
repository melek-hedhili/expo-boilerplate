import { TranslationKeys } from "@/i18n/Types";
import { useTranslation as useTranslationBase } from "react-i18next";

export const useTranslation = () => {
  //@ts-ignore
  const { t, ...rest } = useTranslationBase<TranslationType>();

  // Return `t` with type safety for all translation keys
  return {
    t: (key: TranslationKeys) => t(key),
    ...rest,
  };
};
