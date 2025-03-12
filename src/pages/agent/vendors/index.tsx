import { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Vendor } from "@/types";
import { toast } from "sonner";

export default function AgentVendors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/api/vendors?status=active");
        setVendors(response.data);
      } catch (err) {
        setError("Failed to load vendors.");
        toast.error("Error fetching vendors.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const activeVendors = vendors.filter((vendor) => vendor.status === "active");
  const inactiveVendors = vendors.filter((vendor) => vendor.status === "inactive");

  if (isLoading) return <p>Loading vendors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground">Manage your vendor relationships</p>
          </div>
          <Button onClick={() => navigate("/agent/vendors/invite")}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Vendor
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{vendors.length}</CardTitle>
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
            <VendorList vendors={vendors} navigate={navigate} />
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <VendorList vendors={activeVendors} navigate={navigate} />
          </TabsContent>

          <TabsContent value="inactive" className="space-y-4">
            <VendorList vendors={inactiveVendors} navigate={navigate} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Vendor List Component
const VendorList = ({ vendors, navigate }: { vendors: Vendor[]; navigate: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.length > 0 ? (
        vendors.map((vendor) => (
          <VendorCard key={vendor.id} vendor={vendor} onView={() => navigate(`/agent/vendors/${vendor.id}`)} />
        ))
      ) : (
        <div className="col-span-3 py-8 text-center text-muted-foreground">No vendors found.</div>
      )}
    </div>
  );
};

// Vendor Card Component
const VendorCard = ({ vendor, onView }: { vendor: Vendor; onView: () => void }) => {
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
        <Button variant="ghost" size="sm" className="w-full" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" /> View Details
        </Button>
      </div>
    </Card>
  );
};
