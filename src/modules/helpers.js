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
  [].forEach.call(elem.attributes, (attr) => {
    if (/^data-/.test(attr.name)) {
      const camelCaseName = attr.name.substr(5).replace(/-(.)/g, ($0, $1) => $1.toUpperCase());
      data[camelCaseName] = attr.value;
    }
  });
  return data;
}

import React from 'react';
import Toast from 'components/Toast';
import { store } from 'react-notifications-component';

export function showNotification(err) {
  store.addNotification({
    content: <Toast errorMsg={err && err.toString()} />,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__slideInRight'],
    animationOut: ['animate__animated', 'animate__slideOutRight'],
    dismiss: {
      duration: 5000,
      touch: false,
      pauseOnHover: true,
    },
  });
}
