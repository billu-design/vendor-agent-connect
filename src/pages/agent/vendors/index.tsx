
import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Vendor, Column } from "@/types";
import { sampleVendors } from "@/data/sampleData";
import { Search, Plus, Building2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define columns for the vendors table
const columns: Column[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: { original: Vendor } }) => (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.type}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: { original: Vendor } }) => (
      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        row.original.status === 'active' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {row.original.status}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Vendor } }) => (
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    ),
  },
];

const AgentVendors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter vendors based on search query
  const filteredVendors = sampleVendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
            <p className="text-muted-foreground">Browse and connect with vendors</p>
          </div>
          <Button onClick={() => navigate('/agent/contracts/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{filteredVendors.length}</CardTitle>
              <CardDescription>Total Vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connected vendors available for contracts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {filteredVendors.filter(v => v.status === 'active').length}
              </CardTitle>
              <CardDescription>Active Vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vendors currently accepting new contracts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {filteredVendors.filter(v => v.status === 'inactive').length}
              </CardTitle>
              <CardDescription>Inactive Vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vendors not currently accepting new contracts
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Vendor Directory</CardTitle>
            <CardDescription>Browse all available vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">Filters</Button>
            </div>
            
            <DataTable
              columns={columns}
              data={filteredVendors}
              searchKey="name"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AgentVendors;
