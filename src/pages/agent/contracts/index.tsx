import { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/shared/ContractCard";
import { FileText, Plus, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { sendContractEmail } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Contract } from "@/types";

const AgentContracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingContractId, setLoadingContractId] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!user) return null;

  // Fetch contracts from API
  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/contracts?agentName=${user.name}`);
        setContracts(response.data);
      } catch (err) {
        setError("Failed to fetch contracts.");
        toast.error("Error loading contracts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [user.name]);

  // Update contract status
  const updateContractStatus = async (contractId: string, status: string) => {
    try {
      await axios.put(`/api/contracts/${contractId}`, { status });
      setContracts((prevContracts) =>
        prevContracts.map((c) => (c.id === contractId ? { ...c, status } : c))
      );
      toast.success(`Contract status updated to ${status}`);
    } catch (err) {
      toast.error("Failed to update contract status.");
    }
  };

  // Handle sending contract email
  const handleSendEmail = async (contractId: string) => {
    setLoadingContractId(contractId);
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return;

    try {
      await sendContractEmail(contract.vendorName, contract.id, contract.title);
      await updateContractStatus(contract.id, "sent");
    } catch (err) {
      toast.error("Failed to send contract.");
    } finally {
      setLoadingContractId(null);
    }
  };

  // Group contracts by status
  const draftContracts = contracts.filter((c) => c.status === "draft");
  const activeContracts = contracts.filter((c) => c.status === "signed");
  const pendingContracts = contracts.filter((c) => c.status === "sent");
  const expiredContracts = contracts.filter((c) => c.status === "expired" || c.status === "cancelled");

  if (isLoading) return <p>Loading contracts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <p className="text-muted-foreground">Manage your contracts with vendors</p>
          </div>
          <Button onClick={() => navigate("/agent/contracts/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>

        {/* Contract Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{draftContracts.length}</CardTitle>
              <CardDescription>Draft</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/agent/contracts/new")}>
                <FileText className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{pendingContracts.length}</CardTitle>
              <CardDescription>Pending</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled={pendingContracts.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{activeContracts.length}</CardTitle>
              <CardDescription>Active</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/agent/contracts?filter=active")}>
                View Active
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{expiredContracts.length}</CardTitle>
              <CardDescription>Expired/Cancelled</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate("/agent/contracts?filter=expired")}>
                View Expired
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contract Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onSendEmail={contract.status === "draft" ? () => handleSendEmail(contract.id) : undefined}
                isLoading={loadingContractId === contract.id}
              />
            ))}
          </TabsContent>

          <TabsContent value="draft">
            {draftContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} onSendEmail={() => handleSendEmail(contract.id)} />
            ))}
          </TabsContent>

          <TabsContent value="pending">
            {pendingContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>

          <TabsContent value="active">
            {activeContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>

          <TabsContent value="expired">
            {expiredContracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AgentContracts;
