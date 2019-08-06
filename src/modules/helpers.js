// @flow
/**
 * Helper functions
 * @module Helpers
 */

/**
 * Convert data attributes to Object
 * @param {Element} elem
 * @returns {{}}
 */
export function snapshotToObject(elem: Element): Object {
  const data = {};
  [].forEach.call(elem.attributes, attr => {
    if (/^data-/.test(attr.name)) {
      const camelCaseName = attr.name.substr(5).replace(/-(.)/g, ($0, $1) => $1.toUpperCase());
      data[camelCaseName] = attr.value;
    }
  });
  return data;
}
