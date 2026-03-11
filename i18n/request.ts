import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales} from '../i18n';

export default getRequestConfig(async ({locale}) => {
  const candidate = typeof locale === 'string' ? locale : defaultLocale;
  const safeLocale: string = (locales as readonly string[]).includes(candidate) ? candidate : defaultLocale;

  // MVP: We’re not using message catalogs yet, but next-intl requires a messages object.
  // Later: load `messages/${safeLocale}.json` here.
  return {
    locale: safeLocale,
    messages: {}
  };
});
