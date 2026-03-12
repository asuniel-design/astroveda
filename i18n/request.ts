import {getRequestConfig} from 'next-intl/server';
import {defaultLocale, locales} from '../i18n';

export default getRequestConfig(async ({locale}) => {
  const candidate = typeof locale === 'string' ? locale : defaultLocale;
  const safeLocale: string = (locales as readonly string[]).includes(candidate) ? candidate : defaultLocale;

  const messages = (await import(`../messages/${safeLocale}.json`)).default;

  return {
    locale: safeLocale,
    messages
  };
});
