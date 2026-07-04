import { getLocale, getMessages } from "next-intl/server";
import { getHtmlLang } from "@/lib/i18n/htmlLang";

export async function getSiteLayoutContext() {
  const [messages, locale] = await Promise.all([getMessages(), getLocale()]);
  return { messages, lang: getHtmlLang(locale) };
}
