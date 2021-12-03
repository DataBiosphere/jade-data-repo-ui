import { staticStorageSlot } from 'libs/browser-storage';

export const lastActiveTimeStore = staticStorageSlot(localStorage, 'idleTimeout');
lastActiveTimeStore.update((v) => v || {});
