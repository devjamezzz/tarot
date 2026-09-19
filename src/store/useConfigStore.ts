import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_PACKAGES, type PackageConfig } from '@/lib/packages/defaults';

export type { PackageConfig };

export type FeatureToggles = {
  enableTarot: boolean;
  enableSpiritCard: boolean;
  enableNumerology: boolean;
  enableLoveTarot: boolean;
  enableDailyAuspicious: boolean;
  /** Show AI interpretation blocks on result pages. Off by default (owner constraint). */
  showAiReading: boolean;
};

export const DEFAULT_TOGGLES: FeatureToggles = {
  enableTarot: true,
  enableSpiritCard: true,
  enableNumerology: true,
  enableLoveTarot: true,
  enableDailyAuspicious: true,
  showAiReading: false,
};

export const CONFIG_STORE_VERSION = 2;

interface ConfigState {
  toggles: FeatureToggles;
  packages: PackageConfig[];
  setToggle: (key: keyof FeatureToggles, value: boolean) => void;
  updatePackage: (id: string, updates: Partial<PackageConfig>) => void;
  addPackage: (pkg: PackageConfig) => void;
  removePackage: (id: string) => void;
  reorderPackages: (packages: PackageConfig[]) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      toggles: DEFAULT_TOGGLES,
      packages: DEFAULT_PACKAGES,
      setToggle: (key, value) =>
        set((state) => ({
          toggles: { ...state.toggles, [key]: value },
        })),
      updatePackage: (id, updates) =>
        set((state) => ({
          packages: state.packages.map((pkg) =>
            pkg.id === id ? { ...pkg, ...updates } : pkg
          ),
        })),
      addPackage: (pkg) =>
        set((state) => ({ packages: [...state.packages, pkg] })),
      removePackage: (id) =>
        set((state) => ({ packages: state.packages.filter((p) => p.id !== id) })),
      reorderPackages: (packages) => set({ packages }),
    }),
    {
      name: 'app-config-storage',
      // Defer rehydration to a client-side effect (see StoreHydrator) so that
      // server-rendered HTML and first client render both show the default
      // toggles/packages. Without this, React 19 reports a hydration mismatch
      // on every page that reads from this store after the user has changed
      // any config.
      skipHydration: true,
      version: CONFIG_STORE_VERSION,
      // v1 → v2: packages are re-seeded from DEFAULT_PACKAGES (purges expired
      // promo copy from persisted state) and the new `showAiReading` toggle is
      // added as false. Toggle keys are always merged with defaults so newly
      // added flags never read `undefined`.
      migrate: (persisted: unknown, fromVersion: number) => {
        const state = (persisted ?? {}) as Partial<ConfigState>;
        const packages =
          fromVersion < 2 ? DEFAULT_PACKAGES : (state.packages ?? DEFAULT_PACKAGES);
        return {
          ...state,
          toggles: {
            ...DEFAULT_TOGGLES,
            ...(state.toggles ?? {}),
            ...(fromVersion < 2 ? { showAiReading: false } : {}),
          },
          packages,
        } as ConfigState;
      },
    }
  )
);
