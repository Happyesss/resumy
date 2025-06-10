// This file contains utilities for offline storage and synchronization

import { throttle } from 'lodash';

/**
 * Interface for the offline storage operations
 */
interface OfflineStorage<T> {
  getItem: (key: string) => T | null;
  setItem: (key: string, value: T) => void;
  removeItem: (key: string) => void;
  getAllKeys: () => string[];
  getPendingChanges: () => Record<string, any>;
  savePendingChange: (key: string, operation: 'update' | 'delete', data?: any) => void;
  clearPendingChange: (key: string) => void;
}

/**
 * Factory function to create a typed offline storage instance
 */
export function createOfflineStorage<T>(namespace: string): OfflineStorage<T> {
  const NAMESPACE = `resumy_offline_${namespace}`;
  const PENDING_CHANGES_KEY = `${NAMESPACE}_pending_changes`;

  // Get all keys with the namespace
  const getAllKeys = (): string[] => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(NAMESPACE) && key !== PENDING_CHANGES_KEY) {
          keys.push(key.replace(`${NAMESPACE}_`, ''));
        }
      }
      return keys;
    } catch (error) {
      console.error('Error getting all keys from localStorage:', error);
      return [];
    }
  };

  // Get item from localStorage
  const getItem = (key: string): T | null => {
    try {
      const value = localStorage.getItem(`${NAMESPACE}_${key}`);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  };

  // Set item in localStorage
  const setItem = (key: string, value: T): void => {
    try {
      localStorage.setItem(`${NAMESPACE}_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      // Check if error is due to quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Implement a simple cache eviction strategy
        evictOldItems();
        // Try again after evicting some items
        try {
          localStorage.setItem(`${NAMESPACE}_${key}`, JSON.stringify(value));
        } catch (retryError) {
          console.error(`Error setting localStorage key "${key}" after eviction:`, retryError);
        }
      }
    }
  };

  // Remove item from localStorage
  const removeItem = (key: string): void => {
    try {
      localStorage.removeItem(`${NAMESPACE}_${key}`);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Get pending changes
  const getPendingChanges = (): Record<string, any> => {
    try {
      const pendingChangesStr = localStorage.getItem(PENDING_CHANGES_KEY);
      return pendingChangesStr ? JSON.parse(pendingChangesStr) : {};
    } catch (error) {
      console.error('Error getting pending changes:', error);
      return {};
    }
  };

  // Save pending change
  const savePendingChange = (key: string, operation: 'update' | 'delete', data?: any): void => {
    try {
      const pendingChanges = getPendingChanges();
      pendingChanges[key] = { 
        operation, 
        data, 
        timestamp: Date.now() 
      };
      localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges));
    } catch (error) {
      console.error(`Error saving pending change for key "${key}":`, error);
    }
  };

  // Clear pending change
  const clearPendingChange = (key: string): void => {
    try {
      const pendingChanges = getPendingChanges();
      delete pendingChanges[key];
      localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(pendingChanges));
    } catch (error) {
      console.error(`Error clearing pending change for key "${key}":`, error);
    }
  };

  // Simple cache eviction strategy (remove oldest items)
  const evictOldItems = (): void => {
    try {
      // Get all stored keys and their timestamps
      const keyTimestamps: { key: string; timestamp: number }[] = [];
      const allKeys = getAllKeys();
      
      allKeys.forEach(key => {
        const item = getItem(key);
        if (item && 'updatedAt' in (item as any)) {
          keyTimestamps.push({
            key,
            timestamp: (item as any).updatedAt || 0
          });
        } else {
          // If no timestamp, use a default old timestamp
          keyTimestamps.push({ key, timestamp: 0 });
        }
      });
      
      // Sort by timestamp (oldest first)
      keyTimestamps.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove the oldest 20% or at least 5 items
      const toRemove = Math.max(5, Math.floor(keyTimestamps.length * 0.2));
      keyTimestamps.slice(0, toRemove).forEach(item => {
        removeItem(item.key);
      });
    } catch (error) {
      console.error('Error evicting old items:', error);
    }
  };

  return {
    getItem,
    setItem,
    removeItem,
    getAllKeys,
    getPendingChanges,
    savePendingChange,
    clearPendingChange
  };
}

/**
 * Helper to sync offline data with online database
 */
export const createSyncManager = <T>(
  namespace: string,
  syncFunction: (key: string, operation: 'update' | 'delete', data?: any) => Promise<void>,
  errorHandler: (error: Error) => void
) => {
  const storage = createOfflineStorage<T>(namespace);
  
  // Sync function with throttling to prevent too many API calls
  const syncPendingChanges = throttle(async () => {
    if (!navigator.onLine) {
      return; // Skip sync if offline
    }
    
    const pendingChanges = storage.getPendingChanges();
    const keys = Object.keys(pendingChanges);
    
    if (keys.length === 0) {
      return; // Nothing to sync
    }
    
    // Process each pending change
    for (const key of keys) {
      const { operation, data } = pendingChanges[key];
      
      try {
        await syncFunction(key, operation, data);
        storage.clearPendingChange(key);
      } catch (error) {
        console.error(`Error syncing change for key "${key}":`, error);
        if (error instanceof Error) {
          errorHandler(error);
        }
        // Don't remove the pending change so it can be retried
      }
    }
  }, 5000, { leading: true, trailing: true });

  // Setup online/offline event listeners
  const setupNetworkListeners = () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('Back online, syncing pending changes...');
        syncPendingChanges();
      });
    }
  };
  
  return {
    storage,
    syncPendingChanges,
    setupNetworkListeners
  };
};
