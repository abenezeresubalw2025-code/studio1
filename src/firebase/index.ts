'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';
import { useMemo } from 'react';

// Use a more robust caching strategy for Next.js HMR environments
const globalForFirebase = globalThis as unknown as {
  cachedApp: FirebaseApp | undefined;
  cachedFirestore: Firestore | undefined;
  cachedAuth: Auth | undefined;
};

/**
 * Initializes Firebase services if they haven't been initialized yet.
 * Uses a singleton pattern to ensure only one instance of each service exists,
 * preventing "INTERNAL ASSERTION FAILED" errors in development.
 */
export function initializeFirebase() {
  if (!globalForFirebase.cachedApp) {
    globalForFirebase.cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  
  if (!globalForFirebase.cachedFirestore) {
    globalForFirebase.cachedFirestore = getFirestore(globalForFirebase.cachedApp);
  }
  
  if (!globalForFirebase.cachedAuth) {
    globalForFirebase.cachedAuth = getAuth(globalForFirebase.cachedApp);
  }

  return { 
    firebaseApp: globalForFirebase.cachedApp, 
    firestore: globalForFirebase.cachedFirestore, 
    auth: globalForFirebase.cachedAuth 
  };
}

/**
 * Hook to memoize Firebase references and queries to prevent infinite re-renders.
 */
export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
