import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { env } from './env'

const firebaseConfig = {
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
  storageBucket: env.firebase.storageBucket,
  messagingSenderId: env.firebase.messagingSenderId,
  appId: env.firebase.appId,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export async function enableOfflinePersistence() {
  try {
    await enableIndexedDbPersistence(db)
  } catch (err) {
    if ((err as { code?: string }).code === 'failed-precondition') {
      console.warn('Offline persistence failed: multiple tabs open')
    } else {
      console.warn('Offline persistence failed:', err)
    }
  }
}
