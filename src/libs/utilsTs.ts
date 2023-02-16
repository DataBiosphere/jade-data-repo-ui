/**
 * Given an object of parameters, returns a url encoded query string (e.g. what is to the right of the ?)
 * @param params String keyed object with numbers, strings or boolean values
 * @returns A url encoded query string
 */
export const urlEncodeParams = (params: Record<string, string | number | boolean>) => {
  return Object.entries(params).map(e => `${e[0]}=${encodeURIComponent(e[1])}`).join('&');
};