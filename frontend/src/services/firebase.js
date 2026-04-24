import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            'AIzaSyD7VKto_Srga3O_pC8TTgzROSiHerFx2W8',
  authDomain:        'fairsight-ai.firebaseapp.com',
  projectId:         'fairsight-ai',
  storageBucket:     'fairsight-ai.firebasestorage.app',
  messagingSenderId: '693695460514',
  appId:             '1:693695460514:web:7b21cb10da2330726c13fb',
  measurementId:     'G-KQSQBNXRPE',
}

const app = initializeApp(firebaseConfig)

export const auth    = getAuth(app)
export const db      = getFirestore(app)
export const storage = getStorage(app)

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// ── Register ──────────────────────────────────────────────────────────────────
export async function registerWithEmail({ firstName, lastName, organisation, email, password, sector }) {
  // Step 1: Create Firebase Auth user
  const cred = await createUserWithEmailAndPassword(auth, email, password)

  // Step 2: Send verification email
  await sendEmailVerification(cred.user)

  // Step 3: Save Firestore profile in background (don't await — don't block navigation)
  setDoc(doc(db, 'users', cred.user.uid), {
    uid:           cred.user.uid,
    name:          `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    organisation:  organisation || '',
    email:         email.toLowerCase(),
    sector:        sector || 'Banking & Credit',
    createdAt:     new Date().toISOString(),
    emailVerified: false,
  }).catch(err => console.error('Profile save failed:', err))

  return cred.user
}

// ── Login with email ──────────────────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// ── Login with Google ─────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider)
  const ref  = doc(db, 'users', cred.user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    setDoc(ref, {
      uid:           cred.user.uid,
      name:          cred.user.displayName || '',
      email:         cred.user.email,
      organisation:  '',
      sector:        'Banking & Credit',
      createdAt:     new Date().toISOString(),
      emailVerified: true,
    }).catch(err => console.error('Google profile save failed:', err))
  }
  return cred.user
}

// ── Get Firestore profile ─────────────────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? snap.data() : null
}

// ── Password reset ────────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}

// ── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth)
}

// ── Auth state listener ───────────────────────────────────────────────────────
export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback)
}

export default app