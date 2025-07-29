import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { handleRedirect } from "@/lib/auth";

interface ExtendedUser extends User {
  role?: 'free' | 'starter' | 'pro' | 'vault' | 'agency' | 'admin';
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on page load
    handleRedirect()
      .then((result) => {
        if (result?.user) {
          console.log('Google login successful:', result.user.email);
        }
      })
      .catch((error) => {
        console.error('Google login redirect error:', error);
        // Don't show toast here as it might be called before components are ready
      });

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log('AuthContext - onAuthStateChanged:', { 
        firebaseUser: firebaseUser?.email, 
        uid: firebaseUser?.uid,
        timestamp: new Date().toISOString()
      });
      
      if (firebaseUser) {
        // Create extended user with default role
        // In production, this would fetch the actual role from your backend
        const extendedUser: ExtendedUser = {
          ...firebaseUser,
          role: firebaseUser.email === 'jarviscamp@bellsouth.net' ? 'admin' : 'free'
        };
        console.log('AuthContext - Setting user:', { email: extendedUser.email, role: extendedUser.role });
        setUser(extendedUser);
      } else {
        console.log('AuthContext - Setting user to null');
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
