import { useEffect, useRef, useState } from 'react';
import _ from 'lodash/fp';

/**
 * Performs the given effect, but only on component mount.
 * React's hooks eslint plugin flags [] because it's a common mistake. However, sometimes this is
 * exactly the right thing to do. This function makes the intention clear and avoids the lint error.
 */
export const useOnMount = (fn) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
};

export const validateSnapshotName = (name) =>
  name.length >= 1 && name.length <= 63 && name.match('^[a-zA-Z0-9][_a-zA-Z0-9]*$');

const maybeCall = (maybeFn) => (_.isFunction(maybeFn) ? maybeFn() : maybeFn);

export const delay = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const cond = (...args) => {
  // eslint-disable-next-line no-console
  console.assert(
    _.every(
      (arg) => _.isFunction(arg) || (_.isArray(arg) && arg.length === 2 && _.isFunction(arg[1])),
      args,
    ),
    'Invalid arguments to Utils.cond',
  );
  for (const arg of args) {
    if (_.isArray(arg)) {
      const [predicate, value] = arg;
      if (predicate) return maybeCall(value);
    } else {
      return maybeCall(arg);
    }
  }
  // Makin eslint happy - this line is unreachable with the assert
  return undefined;
};

export const append = _.curry((value, arr) => _.concat(arr, [value]));

export const subscribable = () => {
  let subscribers = [];
  return {
    subscribe: (fn) => {
      subscribers = append(fn, subscribers);
      return {
        unsubscribe: () => {
          subscribers = _.without([fn], subscribers);
        },
      };
    },
    next: (...args) => {
      _.forEach((fn) => fn(...args), subscribers);
    },
  };
};

/**
 * Hook that returns the value of a given store. When the store changes, the component will re-render
 */
export const useStore = (theStore) => {
  const [value, setValue] = useState(theStore.get());
  useEffect(() => theStore.subscribe((v) => setValue(v)).unsubscribe, [theStore, setValue]);
  return value;
};

export const maybeParseJSON = (maybeJSONString) => {
  try {
    return JSON.parse(maybeJSONString);
  } catch {
    return undefined;
  }
};

export const useCancellation = () => {
  const controller = useRef();
  useOnMount(() => {
    const instance = controller.current;
    return () => instance.abort();
  });
  if (!controller.current) {
    controller.current = new window.AbortController();
  }
  return controller.current.signal;
};

export const useCurrentTime = (initialDelay = 250) => {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const signal = useCancellation();
  const delayRef = useRef(initialDelay);
  useOnMount(() => {
    const poll = async () => {
      while (!signal.aborted) {
        // eslint-disable-next-line no-await-in-loop
        await delay(delayRef.current);
        if (!signal.aborted) {
          setCurrentTime(Date.now());
        }
      }
    };
    poll();
  });
  return [
    currentTime,
    (delayTime) => {
      delayRef.current = delayTime;
    },
  ];
};

export const getRoleMembersFromPolicies = (policies, role) => {
  const obj = policies.find((policy) => policy.name === role);
  return (obj && obj.members) || [];
};
