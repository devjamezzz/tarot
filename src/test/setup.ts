/**
 * Vitest setup — minimal browser shims for the node environment.
 *
 * Several storage modules guard on `typeof window === "undefined"` and then
 * read `window.localStorage`. Tests for those modules install their own
 * localStorage mocks, so this file only guarantees that `window` exists and
 * that a configurable `localStorage` is present for tests to override.
 * The whole suite stays on the node environment (no jsdom).
 */

type StorageShim = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  readonly length: number;
};

function createStorageShim(): StorageShim {
  let store: Record<string, string> = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store = { ...store, [key]: String(value) };
    },
    removeItem: (key) => {
      const { [key]: _removed, ...rest } = store;
      store = rest;
    },
    clear: () => {
      store = {};
    },
    key: (index) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    },
  };
}

const g = globalThis as Record<string, unknown>;

if (typeof g.window === 'undefined') {
  Object.defineProperty(globalThis, 'window', {
    value: globalThis,
    configurable: true,
    writable: true,
  });
}

if (typeof g.localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createStorageShim(),
    configurable: true,
    writable: true,
  });
}
