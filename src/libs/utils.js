import { useEffect } from 'react';

/**
 * Performs the given effect, but only on component mount.
 * React's hooks eslint plugin flags [] because it's a common mistake. However, sometimes this is
 * exactly the right thing to do. This function makes the intention clear and avoids the lint error.
 */
export const useOnMount = (fn) => {
  useEffect(fn, []);
};

export const validateSnapshotName = (name) => {
  return name.length >= 1 && name.length <= 63 && name.match('^[a-zA-Z0-9][_a-zA-Z0-9]*$');
};
