import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/**
 * Initialize Firebase using environment variables. Vite exposes any
 * variables prefixed with `VITE_` on `import.meta.env`. At runtime,
 * these values will come from your `.env.local` file when developing or
 * from environment variables configured in your deployment platform
 * (e.g. Vercel). See `.env.example` for expected variable names.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Optional: Measurement ID for Google Analytics (if enabled)
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Helpful warnings when env vars are missing (common when .env.local is in the wrong folder
// or when env vars haven't been added to Vercel).
const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
] as const;

for (const key of requiredKeys) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const val = (import.meta.env as any)[key];
  if (!val) {
    console.warn(
      `[Firebase] Missing env var: ${key}. ` +
        `Make sure .env.local is in the project root (same level as package.json) and restart the dev server.`
    );
  }
}

// Initialize Firebase app; Firebase will ensure initialization occurs only once
const app = initializeApp(firebaseConfig);

// Export a Firestore instance to perform database operations
export const db = getFirestore(app);

// Export Firebase Auth instance (used so Firestore rules can rely on request.auth)
export const auth = getAuth(app);

// Also export the underlying app in case other modules need it
export { app };