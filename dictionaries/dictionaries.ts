"server-only";
import type { Locale } from "./i18n-config";

const dictionaries = {
	en: () => import("./en.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	dictionaries[locale]?.() ?? dictionaries.en();
