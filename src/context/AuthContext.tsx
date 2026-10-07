import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'donor' | 'ngo' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationName: string;
  address: string;
  city: string;
  phone?: string;
  ngoId?: string;
}

const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  donor: {
    id: 'prof-donor-1',
    name: 'Priya Sharma',
    email: 'priya@greenleaf.com',
    role: 'donor',
    organizationName: 'Green Leaf Restaurant',
    address: '102 MG Road, Brigade Junction',
    city: 'Bengaluru',
    phone: '+91 98765 43210',
  },
  ngo: {
    id: 'prof-ngo-1',
    name: 'Father Joseph',
    email: 'joseph@hopecommunity.org',
    role: 'ngo',
    organizationName: 'Hope Community Kitchen',
    address: '14 Residency Road',
    city: 'Bengaluru',
    phone: '+91 97654 32109',
    ngoId: 'ngo-1',
  },
  admin: {
    id: 'prof-admin-1',
    name: 'System Administrator',
    email: 'admin@foodbridge.ai',
    role: 'admin',
    organizationName: 'FoodBridge AI HQ',
    address: 'Indiranagar 100ft Road',
    city: 'Bengaluru',
    phone: '+91 99999 00000',
  },
};

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole) => void;
  loginWithProfile: (profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('foodbridge_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_PROFILES.donor;
      }
    }
    return DEMO_PROFILES.donor; // Default logged in as Donor for smooth demo experience
  });

  const role: UserRole = user?.role || 'donor';

  useEffect(() => {
    if (user) {
      localStorage.setItem('foodbridge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('foodbridge_user');
    }
  }, [user]);

  const loginAsRole = (newRole: UserRole) => {
    setUser(DEMO_PROFILES[newRole]);
  };

  const loginWithProfile = (profile: UserProfile) => {
    setUser(profile);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        loginAsRole,
        loginWithProfile,
        logout,
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
