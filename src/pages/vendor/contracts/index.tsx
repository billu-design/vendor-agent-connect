import { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/shared/ContractCard";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Contract } from "@/types";
import { ContractActions } from "./ContractActions";

const VendorContracts = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch contracts from API
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get(`/api/contracts?vendorId=${user?.id}`);
        setContracts(response.data);
      } catch (err) {
        setError("Failed to load contracts.");
        toast.error("Error fetching contracts.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchContracts();
    }
  }, [user?.id]);

  // Update contract status
  const handleStatusUpdate = async (updatedContract: Contract) => {
    try {
      await axios.put(`/api/contracts/${updatedContract.id}`, { status: updatedContract.status });
      setContracts((prevContracts) =>
        prevContracts.map((contract) => (contract.id === updatedContract.id ? updatedContract : contract))
      );
      toast.success(`Contract status updated to ${updatedContract.status}`);
    } catch (err) {
      toast.error("Failed to update contract status.");
    }
  };

  // Group contracts by status
  const pendingContracts = contracts.filter((c) => c.status === "sent");
  const activeContracts = contracts.filter((c) => c.status === "signed");
  const expiredContracts = contracts.filter((c) => c.status === "expired" || c.status === "cancelled");

  if (isLoading) return <p>Loading contracts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Contracts</h1>
          <p className="text-muted-foreground">View and manage contracts from agents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{pendingContracts.length}</CardTitle>
              <CardDescription>Pending Review</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{activeContracts.length}</CardTitle>
              <CardDescription>Active</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{expiredContracts.length}</CardTitle>
              <CardDescription>Expired/Cancelled</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          {/* All Contracts */}
          <TabsContent value="all" className="space-y-4">
            <ContractList contracts={contracts} isLoading={isLoading} handleStatusUpdate={handleStatusUpdate} />
          </TabsContent>

          {/* Pending Contracts */}
          <TabsContent value="pending" className="space-y-4">
            <ContractList contracts={pendingContracts} isLoading={isLoading} handleStatusUpdate={handleStatusUpdate} />
          </TabsContent>

          {/* Active Contracts */}
          <TabsContent value="active" className="space-y-4">
            <ContractList contracts={activeContracts} isLoading={isLoading} handleStatusUpdate={handleStatusUpdate} />
          </TabsContent>

          {/* Expired Contracts */}
          <TabsContent value="expired" className="space-y-4">
            <ContractList contracts={expiredContracts} isLoading={isLoading} handleStatusUpdate={handleStatusUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// Contract List Component
const ContractList = ({
  contracts,
  isLoading,
  handleStatusUpdate,
}: {
  contracts: Contract[];
  isLoading: boolean;
  handleStatusUpdate: (contract: Contract) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading ? (
        <div className="col-span-3 py-8 text-center text-muted-foreground">Loading contracts...</div>
      ) : contracts.length > 0 ? (
        contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onStatusUpdate={handleStatusUpdate}
            actions={<ContractActions contract={contract} onStatusUpdate={handleStatusUpdate} />}
          />
        ))
      ) : (
        <div className="col-span-3 py-8 text-center text-muted-foreground">No contracts found.</div>
      )}
    </div>
  );
};

export default VendorContracts;
