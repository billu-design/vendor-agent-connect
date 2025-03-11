
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { sampleVendors } from "@/data/sampleData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Eye, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function AgentVendors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filter vendors based on the agent's region or relationships
  const agentVendors = sampleVendors.filter(vendor => 
    // In a real app, this would filter vendors associated with this agent
    vendor.status === 'active'
  );
  
  const activeVendors = agentVendors.filter(vendor => vendor.status === 'active');
  const inactiveVendors = agentVendors.filter(vendor => vendor.status === 'inactive');
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground">Manage your vendor relationships</p>
          </div>
          <Button onClick={() => navigate('/agent/vendors/invite')}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Vendor
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{agentVendors.length}</CardTitle>
              <CardDescription>Total Vendors</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{activeVendors.length}</CardTitle>
              <CardDescription>Active</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{inactiveVendors.length}</CardTitle>
              <CardDescription>Inactive</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">0</CardTitle>
              <CardDescription>Pending Invites</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Vendors</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentVendors.length > 0 ? (
                agentVendors.map(vendor => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    onView={() => navigate(`/agent/vendors/${vendor.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No vendors found. Invite your first vendor.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeVendors.length > 0 ? (
                activeVendors.map(vendor => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    onView={() => navigate(`/agent/vendors/${vendor.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No active vendors found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inactiveVendors.length > 0 ? (
                inactiveVendors.map(vendor => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    onView={() => navigate(`/agent/vendors/${vendor.id}`)}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No inactive vendors found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Vendor Card Component
const VendorCard = ({ 
  vendor, 
  onView 
}: { 
  vendor: { 
    id: string; 
    name: string; 
    type: string; 
    location: string; 
    status: string; 
  }; 
  onView: () => void;
}) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="h-2 bg-gradient-to-r from-primary to-blue-400"></div>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium line-clamp-1">{vendor.name}</CardTitle>
        <StatusBadge status={vendor.status} />
      </CardHeader>
      <CardContent className="p-4 pt-2 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span className="font-medium">{vendor.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span>{vendor.location}</span>
          </div>
        </div>
      </CardContent>
      <div className="p-4 pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full"
          onClick={onView}
        >
          <Eye className="h-4 w-4 mr-1" /> View Details
        </Button>
      </div>
    </Card>
  );
};
