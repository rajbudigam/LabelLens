// Browser storage utilities for LabelLens
import { Analysis, SavedAnalysis, UserPreferences, AppSettings, ComparisonScenario, ReformulationScenario } from './types';

// Keys for localStorage
const STORAGE_KEYS = {
  PREFERENCES: 'labellens_preferences',
  SETTINGS: 'labellens_settings',
  CURRENT_ANALYSIS: 'labellens_current',
} as const;

// Keys for IndexedDB
const IDB_KEYS = {
  SAVED_ANALYSES: 'saved_analyses',
  COMPARISONS: 'comparisons',
  REFORMULATIONS: 'reformulations',
} as const;

// Default preferences
export const DEFAULT_PREFERENCES: UserPreferences = {
  region: 'US',
  allergenConcerns: [],
  a11y: {
    largeText: false,
    reducedMotion: false,
    highContrast: false,
  },
  theme: 'dark',
  language: 'en',
};

export const DEFAULT_SETTINGS: AppSettings = {
  version: '1.0.0',
  analytics: false,
  currencyFormat: 'USD',
  autoSave: true,
};

// localStorage operations
export const localStorage = {
  getPreferences(): UserPreferences {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  setPreferences(prefs: Partial<UserPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      window.localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save preferences:', error);
    }
  },

  getSettings(): AppSettings {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  setSettings(settings: Partial<AppSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      window.localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  },

  getCurrentAnalysis(): Analysis | null {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEYS.CURRENT_ANALYSIS);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setCurrentAnalysis(analysis: Analysis | null): void {
    try {
      if (analysis) {
        window.localStorage.setItem(STORAGE_KEYS.CURRENT_ANALYSIS, JSON.stringify(analysis));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.CURRENT_ANALYSIS);
      }
    } catch (error) {
      console.warn('Failed to save current analysis:', error);
    }
  },
};

// Simple IndexedDB wrapper using idb-keyval pattern
class SimpleStore {
  private dbName = 'labellens_db';
  private version = 1;
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains(IDB_KEYS.SAVED_ANALYSES)) {
          db.createObjectStore(IDB_KEYS.SAVED_ANALYSES, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(IDB_KEYS.COMPARISONS)) {
          db.createObjectStore(IDB_KEYS.COMPARISONS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(IDB_KEYS.REFORMULATIONS)) {
          db.createObjectStore(IDB_KEYS.REFORMULATIONS, { keyPath: 'id' });
        }
      };
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.warn('IndexedDB get failed:', error);
      return undefined;
    }
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });
    } catch (error) {
      console.warn('IndexedDB getAll failed:', error);
      return [];
    }
  }

  async set<T>(storeName: string, value: T): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.put(value);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn('IndexedDB set failed:', error);
    }
  }

  async delete(storeName: string, key: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });
    } catch (error) {
      console.warn('IndexedDB delete failed:', error);
    }
  }
}

const store = new SimpleStore();

// High-level storage API
export const storage = {
  // Saved analyses
  async getSavedAnalyses(): Promise<SavedAnalysis[]> {
    return store.getAll<SavedAnalysis>(IDB_KEYS.SAVED_ANALYSES);
  },

  async saveAnalysis(analysis: SavedAnalysis): Promise<void> {
    return store.set(IDB_KEYS.SAVED_ANALYSES, analysis);
  },

  async deleteAnalysis(id: string): Promise<void> {
    return store.delete(IDB_KEYS.SAVED_ANALYSES, id);
  },

  // Comparisons
  async getComparisons(): Promise<ComparisonScenario[]> {
    return store.getAll<ComparisonScenario>(IDB_KEYS.COMPARISONS);
  },

  async saveComparison(comparison: ComparisonScenario): Promise<void> {
    return store.set(IDB_KEYS.COMPARISONS, comparison);
  },

  async deleteComparison(id: string): Promise<void> {
    return store.delete(IDB_KEYS.COMPARISONS, id);
  },

  // Reformulations
  async getReformulations(): Promise<ReformulationScenario[]> {
    return store.getAll<ReformulationScenario>(IDB_KEYS.REFORMULATIONS);
  },

  async saveReformulation(reformulation: ReformulationScenario): Promise<void> {
    return store.set(IDB_KEYS.REFORMULATIONS, reformulation);
  },

  async deleteReformulation(id: string): Promise<void> {
    return store.delete(IDB_KEYS.REFORMULATIONS, id);
  },
};

// URL encoding for shareable links
export const urlEncoding = {
  encode(data: Record<string, any>): string {
    try {
      return btoa(JSON.stringify(data));
    } catch {
      return '';
    }
  },

  decode<T>(encoded: string): T | null {
    try {
      return JSON.parse(atob(encoded));
    } catch {
      return null;
    }
  },
};
