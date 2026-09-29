import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot,
  query,
  updateDoc,
  deleteDoc 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '../firebase/config';
import { UserProfile, UserStatus } from '../types';
import { INITIAL_STAFF_MEMBERS } from '../data/presets';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  switchActiveProfile: (user: UserProfile) => void;
  updateMyStatus: (status: UserStatus) => Promise<void>;
  isOwner: boolean;
  createUserProfile: (name: string, email: string, role: UserProfile['role'], phone?: string) => Promise<UserProfile>;
  deleteStaffMember: (uid: string) => Promise<void>;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Run initial Firestore connection test as per skill requirement
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Firestore users collection in real time
  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersList: UserProfile[] = [];
      snapshot.forEach((docSnap) => {
        usersList.push(docSnap.data() as UserProfile);
      });

      if (usersList.length === 0) {
        // First boot: Seed default hardware store team members so user has a ready-to-use team!
        const hasSeeded = localStorage.getItem('ferre_has_seeded_v1');
        if (!hasSeeded) {
          seedInitialStaff();
          localStorage.setItem('ferre_has_seeded_v1', 'true');
        }
      } else {
        setAllUsers(usersList);
      }
    }, (error) => {
      console.warn('Could not listen to users collection:', error);
    });

    return () => unsubscribe();
  }, []);

  // Seed realistic hardware store staff if collection is empty
  const seedInitialStaff = async () => {
    try {
      for (const staff of INITIAL_STAFF_MEMBERS) {
        const staffDocRef = doc(db, 'users', staff.uid);
        await setDoc(staffDocRef, staff, { merge: true });
      }
    } catch (err) {
      console.warn('Could not auto-seed staff:', err);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const profile = userSnap.data() as UserProfile;
            setCurrentUser(profile);
          } else {
            // New user registration
            const isFirstOrAdmin = fbUser.email?.toLowerCase().includes('admin') || 
                                   fbUser.email === 'ajnovasistemas@gmail.com' ||
                                   allUsers.length <= 4;
            
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || `${fbUser.uid}@ferreteria.local`,
              displayName: fbUser.displayName || 'Dueño Ferretería',
              role: isFirstOrAdmin ? 'dueño' : 'encargado',
              avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${fbUser.displayName || 'Ferre'}`,
              status: 'disponible',
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setCurrentUser(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
        }
      } else {
        // Fallback: If not logged in with Google yet, default to Dueño profile from staff list or prompt
        const savedStaffUid = localStorage.getItem('ferre_active_uid');
        if (savedStaffUid && allUsers.length > 0) {
          const found = allUsers.find(u => u.uid === savedStaffUid);
          if (found) {
            setCurrentUser(found);
          }
        } else if (allUsers.length > 0) {
          // Default to first user (or a dueño)
          const dueno = allUsers.find(u => u.role === 'dueño') || allUsers[0];
          setCurrentUser(dueno);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [allUsers]);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        localStorage.setItem('ferre_active_uid', res.user.uid);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('ferre_active_uid');
      if (allUsers.length > 0) {
        setCurrentUser(allUsers[0]);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Switch profile in shop/tablet mode
  const switchActiveProfile = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('ferre_active_uid', user.uid);
  };

  const updateMyStatus = async (status: UserStatus) => {
    if (!currentUser) return;
    try {
      const updated = { ...currentUser, status };
      setCurrentUser(updated);
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { status });
    } catch (error) {
      console.warn('Status update warning:', error);
    }
  };

  const createUserProfile = async (
    name: string, 
    email: string, 
    role: UserProfile['role'], 
    phone?: string
  ): Promise<UserProfile> => {
    const uid = `staff_${Date.now()}`;
    const newStaff: UserProfile = {
      uid,
      email,
      displayName: name,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      status: 'disponible',
      phone: phone || '',
      createdAt: new Date().toISOString()
    };

    // Optimistically update allUsers state so the collaborator appears instantly
    setAllUsers((prev) => {
      const exists = prev.some(u => u.uid === uid);
      if (exists) return prev;
      const updated = [...prev, newStaff];
      try {
        localStorage.setItem('ferre_cached_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const staffRef = doc(db, 'users', uid);
      await setDoc(staffRef, newStaff);
      return newStaff;
    } catch (error) {
      console.warn('Firestore setDoc user warning, kept in local state:', error);
      return newStaff;
    }
  };

  const deleteStaffMember = async (uid: string) => {
    // If deleted user is current user, switch to another profile
    if (currentUser?.uid === uid) {
      const remaining = allUsers.filter((u) => u.uid !== uid);
      if (remaining.length > 0) {
        setCurrentUser(remaining[0]);
        try {
          localStorage.setItem('ferre_active_user', JSON.stringify(remaining[0]));
        } catch {}
      }
    }

    setAllUsers((prev) => {
      const updated = prev.filter((u) => u.uid !== uid);
      try {
        localStorage.setItem('ferre_cached_users', JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const staffRef = doc(db, 'users', uid);
      await deleteDoc(staffRef);
    } catch (err) {
      console.warn('Could not delete staff from Firestore:', err);
    }
  };

  const isOwner = currentUser?.role === 'dueño' || currentUser?.role === 'encargado';

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        currentUser,
        allUsers,
        loading,
        loginWithGoogle,
        logout,
        switchActiveProfile,
        updateMyStatus,
        isOwner,
        createUserProfile,
        deleteStaffMember,
        isOnline
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
