import { ui, languages, defaultLang, showDefaultLang, ogLocales, type SupportedLanguage } from './ui';

/**
 * Extract language code from URL pathname or return defaultLang.
 */
export function getLangFromUrl(url: URL): SupportedLanguage {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in languages) {
    return lang as SupportedLanguage;
  }
  return defaultLang;
}

/**
 * Get translation helper for a given language.
 */
export function useTranslations(lang: SupportedLanguage = defaultLang) {
  const localizedUI = ui[lang] || ui[defaultLang];
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    if (key in localizedUI) {
      return (localizedUI as Record<string, string>)[key];
    }
    return (ui[defaultLang] as Record<string, string>)[key] || (key as string);
  };
}

/**
 * Get function to create localized path for a given language.
 */
export function useTranslatedPath(lang: SupportedLanguage = defaultLang) {
  return function translatePath(path: string, targetLang: SupportedLanguage = lang): string {
    // Normalize path to always start with /
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Strip any existing language prefix from path
    for (const l of Object.keys(languages)) {
      if (cleanPath === `/${l}` || cleanPath === `/${l}/`) {
        cleanPath = '/';
        break;
      } else if (cleanPath.startsWith(`/${l}/`)) {
        cleanPath = cleanPath.slice(l.length + 1);
        break;
      }
    }

    if (cleanPath === '') cleanPath = '/';

    // Build localized path
    if (!showDefaultLang && targetLang === defaultLang) {
      return cleanPath;
    }

    if (cleanPath === '/') {
      return `/${targetLang}`;
    }

    return `/${targetLang}${cleanPath}`;
  };
}

/**
 * Strip language prefix from URL path to get base route.
 */
export function getBaseRoute(pathname: string): string {
  let cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  for (const l of Object.keys(languages)) {
    if (cleanPath === `/${l}` || cleanPath === `/${l}/`) {
      return '/';
    }
    if (cleanPath.startsWith(`/${l}/`)) {
      return cleanPath.slice(l.length + 1);
    }
  }
  return cleanPath;
}

/**
 * Generate complete hreflang alternate links for SEO <head>.
 */
export function getAlternateHreflangLinks(pathname: string, siteUrl = 'https://onscicalc.com') {
  const baseRoute = getBaseRoute(pathname);
  const normalizedBase = baseRoute === '/' ? '' : baseRoute;

  const alternates = (Object.keys(languages) as SupportedLanguage[]).map((l) => {
    let href: string;
    if (!showDefaultLang && l === defaultLang) {
      href = normalizedBase ? `${siteUrl}${normalizedBase}` : siteUrl;
    } else {
      href = `${siteUrl}/${l}${normalizedBase}`;
    }
    return {
      hreflang: l,
      href,
    };
  });

  // Add x-default pointing to default locale (English)
  alternates.push({
    hreflang: 'x-default',
    href: normalizedBase ? `${siteUrl}${normalizedBase}` : siteUrl,
  });

  return alternates;
}

/**
 * Check if the language is right-to-left.
 */
export function isRtlLang(lang: string): boolean {
  if (lang in languages) {
    return languages[lang as SupportedLanguage].dir === 'rtl';
  }
  return false;
}

/**
 * Get Open Graph locale string.
 */
export function getOgLocale(lang: SupportedLanguage): string {
  return ogLocales[lang] || 'en_US';
}
