import { AppLayout } from "@/components/layout/AppLayout";
import { DataTable } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Contract, Column } from "@/types";
import { sampleContracts } from "@/data/sampleData";
import { Search, Plus, FileText, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

// Define columns for the contracts table
const columns: Column[] = [{
  accessorKey: "title",
  header: "Contract",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-medium">{row.original.title}</div>
          <div className="text-xs text-muted-foreground">ID: {row.original.id}</div>
        </div>
      </div>
}, {
  accessorKey: "agentName",
  header: "Agent"
}, {
  accessorKey: "vendorName",
  header: "Vendor"
}, {
  accessorKey: "status",
  header: "Status",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => {
    const statusMap: Record<string, {
      color: string;
    }> = {
      draft: {
        color: "bg-yellow-100 text-yellow-800"
      },
      sent: {
        color: "bg-blue-100 text-blue-800"
      },
      signed: {
        color: "bg-green-100 text-green-800"
      },
      expired: {
        color: "bg-gray-100 text-gray-800"
      },
      cancelled: {
        color: "bg-red-100 text-red-800"
      }
    };
    const status = row.original.status;
    const style = statusMap[status] || {
      color: "bg-gray-100 text-gray-800"
    };
    return <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.color}`}>
          {status}
        </div>;
  }
}, {
  accessorKey: "value",
  header: "Value",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => formatCurrency(row.original.value)
}, {
  accessorKey: "createdAt",
  header: "Created",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => new Date(row.original.createdAt).toLocaleDateString()
}, {
  accessorKey: "expiresAt",
  header: "Expires",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => new Date(row.original.expiresAt).toLocaleDateString()
}, {
  id: "actions",
  header: "Actions",
  cell: ({
    row
  }: {
    row: {
      original: Contract;
    };
  }) => <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          View
        </Button>
      </div>
}];
const AdminContracts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter contracts based on search query
  const filteredContracts = sampleContracts.filter(contract => contract.title.toLowerCase().includes(searchQuery.toLowerCase()) || contract.agentName.toLowerCase().includes(searchQuery.toLowerCase()) || contract.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || contract.status.toLowerCase().includes(searchQuery.toLowerCase()));

  // Calculate summary statistics
  const totalValue = filteredContracts.reduce((sum, contract) => sum + contract.value, 0);
  const activeContracts = filteredContracts.filter(c => c.status === 'signed');
  const pendingContracts = filteredContracts.filter(c => c.status === 'draft' || c.status === 'sent');
  return <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <p className="text-muted-foreground">Manage and view all contracts</p>
          </div>
          
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{filteredContracts.length}</CardTitle>
              <CardDescription>Total Contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All contracts in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {formatCurrency(totalValue)}
              </CardTitle>
              <CardDescription>Total Value</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Combined value of all contracts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {activeContracts.length}
              </CardTitle>
              <CardDescription>Active Contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Currently signed and active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">
                {pendingContracts.length}
              </CardTitle>
              <CardDescription>Pending Contracts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Awaiting signatures
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Contracts</CardTitle>
            <CardDescription>View and manage all contract documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search contracts..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <Button variant="outline">Filters</Button>
            </div>
            
            <DataTable columns={columns} data={filteredContracts} searchKey="title" />
          </CardContent>
        </Card>
      </div>
    </AppLayout>;
};
export default AdminContracts;