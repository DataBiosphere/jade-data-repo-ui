import { staticStorageSlot } from 'libs/browser-storage';
import * as Utils from 'libs/utils';

export const lastActiveTimeStore = staticStorageSlot(localStorage, 'idleTimeout');
lastActiveTimeStore.update((v) => v || {});

export const authStore = Utils.atom({
  isSignedIn: undefined,
  anonymousId: undefined,
  registrationStatus: undefined,
  acceptedTos: undefined,
  user: {},
  profile: {},
  fenceStatus: {},
  cookiesAccepted: undefined,
});
