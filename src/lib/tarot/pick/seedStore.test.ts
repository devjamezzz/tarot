import { describe, it, expect, beforeEach, vi } from "vitest";

function installSessionStorage() {
  let store: Record<string, string> = {};
  const shim = {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store = { ...store, [key]: String(value) };
    },
    removeItem: (key: string) => {
      store = Object.fromEntries(Object.entries(store).filter(([k]) => k !== key));
    },
    clear: () => {
      store = {};
    },
    key: () => null,
    get length() {
      return Object.keys(store).length;
    },
  };
  Object.defineProperty(globalThis.window, "sessionStorage", {
    value: shim,
    configurable: true,
    writable: true,
  });
  return shim;
}

describe("seedStore", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("creates a seed once, persists it and returns the same value on re-read", async () => {
    const storage = installSessionStorage();
    const mod = await import("./seedStore");

    const first = mod.getPickSeed();
    expect(Number.isInteger(first)).toBe(true);
    expect(storage.getItem(mod.PICK_SEED_STORAGE_KEY)).toBe(String(first));
    expect(mod.getPickSeed()).toBe(first);
    expect(mod.getPickSeedServerSnapshot()).toBeNull();
  });

  it("re-uses a seed already stored for this visit", async () => {
    const storage = installSessionStorage();
    const mod = await import("./seedStore");
    storage.setItem(mod.PICK_SEED_STORAGE_KEY, "123456");

    expect(mod.getPickSeed()).toBe(123456);
  });

  it("ignores a corrupt stored value", async () => {
    const storage = installSessionStorage();
    const mod = await import("./seedStore");
    storage.setItem(mod.PICK_SEED_STORAGE_KEY, "not-a-number");

    const seed = mod.getPickSeed();
    expect(Number.isInteger(seed)).toBe(true);
    expect(storage.getItem(mod.PICK_SEED_STORAGE_KEY)).toBe(String(seed));
  });

  it("reseedPick mints a new seed, persists it and notifies subscribers", async () => {
    const storage = installSessionStorage();
    const mod = await import("./seedStore");
    const listener = vi.fn();
    const unsubscribe = mod.subscribePickSeed(listener);

    const before = mod.getPickSeed();
    const after = mod.reseedPick();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(mod.getPickSeed()).toBe(after);
    expect(storage.getItem(mod.PICK_SEED_STORAGE_KEY)).toBe(String(after));
    // A 32-bit collision is possible but astronomically unlikely.
    expect(after).not.toBe(before);

    unsubscribe();
    mod.reseedPick();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
