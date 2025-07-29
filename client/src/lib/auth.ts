import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    await signInWithRedirect(auth, provider);
  } catch (error: any) {
    console.error('Google login error:', error);
    throw new Error(`Google login failed: ${error.message || 'Unknown error'}`);
  }
}

export async function loginWithEmail(email: string, password: string, captchaToken?: string) {
  // First verify reCAPTCHA on backend
  if (captchaToken) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, captchaToken }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "reCAPTCHA verification failed");
    }
  }
  
  // Then proceed with Firebase authentication
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function signupWithEmail(email: string, password: string) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  return await signOut(auth);
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export function handleRedirect() {
  return getRedirectResult(auth);
}
