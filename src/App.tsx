
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
            <Route path="/admin/agents" element={<Agents />} />
            <Route path="/admin/agents/edit/:id" element={<NotFound />} />
            <Route path="/admin/vendors" element={<Vendors />} />
            <Route path="/admin/vendors/edit/:id" element={<NotFound />} />
            <Route path="/admin/contracts" element={<NotFound />} />
            <Route path="/admin/reports" element={<NotFound />} />
            <Route path="/agent/contracts" element={<NotFound />} />
            <Route path="/agent/vendors" element={<NotFound />} />
            <Route path="/agent/messages" element={<NotFound />} />
            <Route path="/profile" element={<NotFound />} />
            <Route path="/settings" element={<NotFound />} />
            <Route path="/about" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
