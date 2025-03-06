
import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && requireAuth && !user) {
      navigate('/login');
    }
  }, [loading, requireAuth, user, navigate]);
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (requireAuth && !user) {
    return null; // Will redirect to login
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className={`flex-1 p-6 ${user ? 'ml-64' : ''} animate-slide-up`}>
          {children}
        </main>
      </div>
    </div>
  );
}
