'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { firebaseConfig } from './config';

let cachedApp: FirebaseApp | undefined;
let cachedFirestore: Firestore | undefined;
let cachedAuth: Auth | undefined;

/**
 * Initializes Firebase services if they haven't been initialized yet.
 * Uses a singleton pattern to ensure only one instance of each service exists,
 * preventing "INTERNAL ASSERTION FAILED" errors in development.
 */
export function initializeFirebase() {
  if (!cachedApp) {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    cachedFirestore = getFirestore(cachedApp);
    cachedAuth = getAuth(cachedApp);
  }

  return { 
    firebaseApp: cachedApp, 
    firestore: cachedFirestore, 
    auth: cachedAuth 
  };
}

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-doc';
export * from './firestore/use-collection';
