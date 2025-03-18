
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, User } from '@/types';
import { loginUser } from '@/data/sampleData';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check local storage for verified vendors with passwords
      const storedVendors = localStorage.getItem('verified_vendors');
      let verifiedVendors: Record<string, { password: string; name: string }> = {};
      
      if (storedVendors) {
        verifiedVendors = JSON.parse(storedVendors);
      }
      
      // Check if this is a verified vendor with password
      if (verifiedVendors[email] && verifiedVendors[email].password === password) {
        const vendorUser: User = {
          id: email.split('@')[0],
          name: verifiedVendors[email].name,
          email: email,
          role: 'vendor',
          verified: true
        };
        
        localStorage.setItem('user', JSON.stringify(vendorUser));
        setUser(vendorUser);
        toast.success(`Welcome back, ${vendorUser.name}!`);
        return;
      }
      
      // If not a verified vendor, try regular login
      const user = loginUser(email, password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success(`Welcome back, ${user.name}!`);
    } catch (e) {
      setError((e as Error).message);
      toast.error('Login failed: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const completeVendorRegistration = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get existing vendors or create new object
      const storedVendors = localStorage.getItem('verified_vendors');
      let verifiedVendors: Record<string, { password: string; name: string }> = {};
      
      if (storedVendors) {
        verifiedVendors = JSON.parse(storedVendors);
      }
      
      // Save vendor password
      verifiedVendors[email] = { 
        password, 
        name: email.split('@')[0] // Simple name extraction from email
      };
      
      localStorage.setItem('verified_vendors', JSON.stringify(verifiedVendors));
      
      // Create vendor user
      const vendorUser: User = {
        id: email.split('@')[0],
        name: verifiedVendors[email].name,
        email: email,
        role: 'vendor',
        verified: true
      };
      
      // Set as current user
      localStorage.setItem('user', JSON.stringify(vendorUser));
      setUser(vendorUser);
      
      toast.success('Registration completed successfully!');
    } catch (e) {
      setError((e as Error).message);
      toast.error('Registration failed: ' + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    // Clear all auth-related state and storage
    localStorage.removeItem('user');
    setUser(null);
    
    // Force a clean reload of the app
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    completeVendorRegistration
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
