import { useState, useEffect } from 'react';
import { createOfflineStorage } from '../utils/offlineStorage';

/**
 * Custom hook for managing offline mode and data synchronization
 * 
 * @param userId - The user's ID for namespacing storage
 * @returns - Object with offline status and helper functions
 */
export function useOfflineMode(userId: string | undefined) {
  const [isOffline, setIsOffline] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Create storage instances with namespace including userId
  const getStorage = <T>(type: string) => {
    if (!userId) {
      throw new Error('User ID is required for offline storage');
    }
    return createOfflineStorage<T>(`${userId}_${type}`);
  };
  
  // Check for network status
  useEffect(() => {
    const updateNetworkStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      if (!offline) {
        checkPendingChanges();
      }
    };
    
    // Set initial state
    updateNetworkStatus();
    
    // Add listeners
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, [userId]);

  // Check if there are any pending changes in all stores
  const checkPendingChanges = () => {
    if (!userId) return;
    
    try {
      // Create storage instances
      const stores = [
        'work_experience',
        'education',
        'skills',
        'projects',
        'profile'
      ].map(type => createOfflineStorage<any>(`${userId}_${type}`));
      
      // Check for pending changes
      const hasPending = stores.some(store => {
        const changes = store.getPendingChanges();
        return Object.keys(changes).length > 0;
      });
      
      setHasPendingChanges(hasPending);
    } catch (error) {
      console.error('Error checking for pending changes:', error);
    }
  };

  // Save data to offline storage
  const saveOffline = <T>(type: string, key: string, data: T) => {
    if (!userId) return;
    
    try {
      const storage = getStorage<T>(type);
      storage.setItem(key, data);
      storage.savePendingChange(key, 'update', data);
      setHasPendingChanges(true);
    } catch (error) {
      console.error(`Error saving offline data for ${type}:`, error);
    }
  };

  // Get data from offline storage
  const getOffline = <T>(type: string, key: string): T | null => {
    if (!userId) return null;
    
    try {
      const storage = getStorage<T>(type);
      return storage.getItem(key);
    } catch (error) {
      console.error(`Error retrieving offline data for ${type}:`, error);
      return null;
    }
  };

  // Clear pending changes after successful sync
  const clearPendingChanges = (type: string, key: string) => {
    if (!userId) return;
    
    try {
      const storage = getStorage<any>(type);
      storage.clearPendingChange(key);
      checkPendingChanges();
    } catch (error) {
      console.error(`Error clearing pending changes for ${type}:`, error);
    }
  };

  return {
    isOffline,
    hasPendingChanges,
    saveOffline,
    getOffline,
    clearPendingChanges,
    checkPendingChanges
  };
}
