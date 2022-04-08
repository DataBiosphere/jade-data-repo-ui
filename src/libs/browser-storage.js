import _ from 'lodash/fp';
import { maybeParseJSON, subscribable } from 'libs/utils';

/*
 * This library provides a higher level interface on top of localStorage and sessionStorage.
 * Values must be JSON-serializable. The 'dynamic' version is preferred if possible, but dynamic
 * values might be deleted in case of space overflow. For critical data, use the 'static' version.
 */

const forceSetItem = (storage, key, value) => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      storage.setItem(key, value);
      return;
    } catch (error) {
      const candidates = _.filter(([k]) => _.startsWith('dynamic-storage/', k), _.toPairs(storage));
      if (!candidates.length) {
        // eslint-disable-next-line no-console
        console.error('Could not write to storage, and no entries to delete');
        return;
      }
      const [chosenKey] = _.head(
        _.sortBy(([, v]) => {
          const data = maybeParseJSON(v);
          return data && _.isInteger(data.timestamp) ? data.timestamp : -Infinity;
        }, candidates),
      );
      storage.removeItem(chosenKey);
    }
  }
};

export const getStatic = (storage, key) => maybeParseJSON(storage.getItem(key));

export const setStatic = (storage, key, value) => {
  if (value === undefined) {
    storage.removeItem(key);
  } else {
    forceSetItem(storage, key, JSON.stringify(value));
  }
};

export const listenStatic = (storage, key, fn) => {
  window.addEventListener('storage', (e) => {
    if (e.storageArea === storage && e.key === key) {
      fn(maybeParseJSON(e.newValue));
    }
  });
};

export const getDynamic = (storage, key) => {
  const storageKey = `dynamic-storage/${key}`;
  const data = maybeParseJSON(storage.getItem(storageKey));
  return data?.value;
};

export const setDynamic = (storage, key, value) => {
  const storageKey = `dynamic-storage/${key}`;
  if (value === undefined) {
    storage.removeItem(storageKey);
  } else {
    forceSetItem(storage, storageKey, JSON.stringify({ timestamp: Date.now(), value }));
  }
};

export const listenDynamic = (storage, key, fn) => {
  const storageKey = `dynamic-storage/${key}`;
  window.addEventListener('storage', (e) => {
    if (e.storageArea === storage && e.key === storageKey) {
      const data = maybeParseJSON(e.newValue);
      fn(data?.value);
    }
  });
};

/**
 * Returns a stateful object that manages the given storage location.
 * Implements the Store interface, and can be passed to useStore.
 */

export const staticStorageSlot = (storage, key) => {
  const { subscribe, next } = subscribable();
  const get = () => getStatic(storage, key);
  const set = (newValue) => {
    setStatic(storage, key, newValue);
    next(newValue);
  };
  listenStatic(storage, key, next);
  return { subscribe, get, set, update: (fn) => set(fn(get())) };
};
