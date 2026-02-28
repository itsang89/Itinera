import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from 'firebase/firestore'
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

// Use persistentSingleTabManager to avoid localStorage (avoids "INTERNAL ASSERTION FAILED: Unexpected state"
// when localStorage is full or corrupted - see firebase/firebase-js-sdk#8305)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(undefined),
  }),
})

export const googleProvider = new GoogleAuthProvider()
