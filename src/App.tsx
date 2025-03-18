import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Agents from "./pages/admin/agents";
import Vendors from "./pages/admin/vendors";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import About from "./pages/About";
import AdminContracts from "./pages/admin/contracts";
import AdminReports from "./pages/admin/reports";
import EditAgent from "./pages/admin/agents/edit/[id]";
import EditVendor from "./pages/admin/vendors/edit/[id]";
import VendorContracts from "./pages/vendor/contracts";
import VendorContractDetails from "./pages/vendor/contracts/[id]";
import VendorMessages from "./pages/vendor/messages";
import AdminServices from "./pages/admin/services";
import AgentDetails from "./pages/admin/agents/[id]";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            
            {/* Admin routes */}
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/agents/:id" element={<AgentDetails />} />
            <Route path="/admin/agents/edit/:id" element={<EditAgent />} />
            <Route path="/admin/vendors" element={<Vendors />} />
            <Route path="/admin/vendors/edit/:id" element={<EditVendor />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/contracts" element={<AdminContracts />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            
            {/* Vendor routes */}
            <Route path="/vendor/contracts" element={<VendorContracts />} />
            <Route path="/vendor/contracts/:id" element={<VendorContractDetails />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
