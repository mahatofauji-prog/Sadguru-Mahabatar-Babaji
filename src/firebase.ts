import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const dbId = firebaseConfig.firestoreDatabaseId;

let firestoreDb: any;
try {
  firestoreDb = dbId
    ? initializeFirestore(
        app,
        {
          experimentalForceLongPolling: true,
        },
        dbId
      )
    : initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
} catch (_) {
  firestoreDb = dbId ? getFirestore(app, dbId) : getFirestore(app);
}

export const db = firestoreDb;
export const storage = getStorage(app);

export default app;

