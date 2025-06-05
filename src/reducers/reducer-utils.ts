export const getAuthDomain = (authDomain?: string | null): string[] =>
  authDomain == null ? [] : [authDomain];
