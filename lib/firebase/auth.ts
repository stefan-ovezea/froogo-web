import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "./config";

export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signUpWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

const handleAuthError = (error: any): string => {
  const code = error.code;
  switch (code) {
    case 'auth/user-not-found':
      return 'Nu există niciun utilizator cu acest email.';
    case 'auth/wrong-password':
      return 'Parolă incorectă.';
    case 'auth/email-already-in-use':
      return 'Acest email este deja folosit.';
    case 'auth/invalid-email':
      return 'Email invalid.';
    case 'auth/weak-password':
      return 'Parola este prea slabă.';
    case 'auth/operation-not-allowed':
      return 'Operațiune nepermisă.';
    case 'auth/user-disabled':
      return 'Acest cont a fost dezactivat.';
    default:
      return `A apărut o eroare: ${error.message}`;
  }
};
