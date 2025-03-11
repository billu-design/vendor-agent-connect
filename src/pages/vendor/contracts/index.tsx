
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { sampleContracts } from "@/data/sampleData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Contract } from "@/types";
import { ContractCard } from "@/components/shared/ContractCard";
import { toast } from "sonner";

export default function VendorContracts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Filter contracts relevant to this vendor
  const vendorContracts = sampleContracts.filter(
    (contract) => 
      contract.vendorName.toLowerCase() === user?.name.toLowerCase() || 
      contract.vendorId === user?.id
  );
  
  const filteredContracts = activeTab === "all" 
    ? vendorContracts 
    : vendorContracts.filter((contract) => contract.status === activeTab);

  const handleUpdateStatus = (contract: Contract) => {
    setSelectedContract(contract);
    setNewStatus(contract.status);
    setIsUpdateDialogOpen(true);
  };

  const confirmStatusUpdate = () => {
    if (!selectedContract || !newStatus) return;
    
    setIsUpdating(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success(`Contract status updated to ${newStatus}`);
      setIsUpdating(false);
      setIsUpdateDialogOpen(false);
    }, 1000);
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Contracts</h1>
        <p className="text-muted-foreground">View and manage your contracts</p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="sent">Pending</TabsTrigger>
            <TabsTrigger value="signed">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {filteredContracts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onStatusUpdate={handleUpdateStatus}
                  isLoading={isUpdating && selectedContract?.id === contract.id}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Contracts Found</CardTitle>
                <CardDescription>
                  There are no contracts matching the selected filter.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Check back later or change your filter criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Contract Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Contract Status</DialogTitle>
            <DialogDescription>
              Change the status of this contract
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <p className="text-sm font-medium">Contract: {selectedContract?.title}</p>
              <p className="text-sm text-muted-foreground">Current status: {selectedContract?.status}</p>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                New Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="signed">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStatusUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
