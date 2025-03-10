
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Agents from "./pages/admin/agents";
import Vendors from "./pages/admin/vendors";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AgentContracts from "./pages/agent/contracts";
import AgentVendors from "./pages/agent/vendors";
import AgentMessages from "./pages/agent/messages";
import AdminContracts from "./pages/admin/contracts";
import AdminReports from "./pages/admin/reports";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin routes */}
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/agents/edit/:id" element={<NotFound />} />
            <Route path="/admin/vendors" element={<Vendors />} />
            <Route path="/admin/vendors/edit/:id" element={<NotFound />} />
            <Route path="/admin/contracts" element={<AdminContracts />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            {/* Agent routes */}
            <Route path="/agent/contracts" element={<AgentContracts />} />
            <Route path="/agent/contracts/new" element={<AgentContracts />} />
            <Route path="/agent/vendors" element={<AgentVendors />} />
            <Route path="/agent/messages" element={<AgentMessages />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
