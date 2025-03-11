
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  BarChart2, 
  Building2, 
  FileText, 
  Home, 
  LogOut,
  Mail, 
  Settings, 
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!user) return null;
  
  const isActive = (path: string) => location.pathname === path;
  
  const adminLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Agents", path: "/admin/agents" },
    { icon: Building2, label: "Vendors", path: "/admin/vendors" },
    { icon: FileText, label: "Contracts", path: "/admin/contracts" },
    { icon: BarChart2, label: "Reports", path: "/admin/reports" },
  ];
  
  const agentLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Contracts", path: "/agent/contracts" },
    { icon: Building2, label: "Vendors", path: "/agent/vendors" },
    { icon: Mail, label: "Messages", path: "/agent/messages" },
  ];
  
  const vendorLinks = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Contracts", path: "/vendor/contracts" },
    { icon: Users, label: "Agents", path: "/vendor/agents" },
    { icon: Mail, label: "Messages", path: "/vendor/messages" },
  ];
  
  let links;
  switch (user.role) {
    case 'admin':
      links = adminLinks;
      break;
    case 'agent':
      links = agentLinks;
      break;
    case 'vendor':
      links = vendorLinks;
      break;
    default:
      links = [];
  }

  return (
    <aside className="h-screen w-64 border-r border-border/40 p-6 bg-card/50 flex flex-col fixed left-0 animate-fade-in">
      <div className="flex items-center justify-center mb-8">
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          V-Connect
        </span>
      </div>
      
      <nav className="space-y-1 flex-1">
        {links.map((link) => (
          <Button
            key={link.path}
            variant={isActive(link.path) ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start mb-1 group transition-all",
              isActive(link.path) 
                ? "bg-secondary font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => navigate(link.path)}
          >
            <link.icon 
              className={cn(
                "mr-3 h-5 w-5",
                isActive(link.path) 
                  ? "text-primary animate-slide-up" 
                  : "text-muted-foreground group-hover:text-foreground"
              )} 
            />
            {link.label}
          </Button>
        ))}
      </nav>
      
      <div className="mt-auto space-y-3">
        <Separator />
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/settings')}
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
