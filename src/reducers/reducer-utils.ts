export const getAuthDomain = (authDomain?: string): string[] =>
  authDomain === undefined ? [] : [authDomain];
