import { AppState } from '../types';
// Firestore integration
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Key used for localStorage fallback. Namespaced to avoid collisions with other apps.
const STORAGE_KEY = 'levelday_app_state';

/**
 * Persist app state to localStorage. This is kept for offline fallback or
 * environments where Firestore is not available. For the primary
 * persistence layer, use {@link saveToFirebase} instead.
 */
export const saveToStorage = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load app state from localStorage. Returns `null` if no state is stored
 * or parsing fails. Use this as a fallback when Firebase is unavailable.
 */
export const loadFromStorage = (): AppState | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as AppState) : null;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

/**
 * Remove persisted state from localStorage. Useful when a user logs out or
 * when resetting the application.
 */
export const clearStorage = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

/*
 * Firebase persistence functions
 *
 * These functions persist the application state to Firestore. Each user
 * document under the `appState` collection contains a snapshot of the
 * entire state tree. Because Firestore operations are asynchronous,
 * these helpers return promises. In case of failure, errors are
 * propagated so callers can handle them appropriately.
 */

const COLLECTION_NAME = 'appState';

/**
 * Load application state from Firestore for a given user. If no document
 * exists or an error occurs, `null` is returned and callers should
 * initialize a default state.
 *
 * @param userId Unique identifier for the authenticated user.
 */
export const loadFromFirebase = async (userId: string): Promise<AppState | null> => {
  try {
    const ref = doc(db, COLLECTION_NAME, userId);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data() as AppState;
    return data;
  } catch (error) {
    console.error('Failed to load from Firebase:', error);
    return null;
  }
};

/**
 * Save the entire application state to Firestore under the current
 * userId. If the document does not exist, it will be created. Because
 * Firestore overwrites documents on `setDoc`, only the provided state
 * will be stored. Consider implementing partial updates if the state
 * becomes large.
 *
 * @param userId Unique identifier for the authenticated user.
 * @param state Current application state tree.
 */
export const saveToFirebase = async (userId: string, state: AppState): Promise<void> => {
  try {
    const ref = doc(db, COLLECTION_NAME, userId);
    await setDoc(ref, state);
  } catch (error) {
    console.error('Failed to save to Firebase:', error);
  }
};
