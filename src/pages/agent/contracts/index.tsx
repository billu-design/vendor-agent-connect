
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/shared/ContractCard";
import { FileText, Plus, Send } from "lucide-react";
import { sampleContracts } from "@/data/sampleData";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { sendContractEmail } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const AgentContracts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  if (!user) return null;
  
  // Filter contracts for the current agent
  const agentContracts = sampleContracts.filter(contract => contract.agentName === user.name);
  
  // Group contracts by status
  const draftContracts = agentContracts.filter(c => c.status === 'draft');
  const activeContracts = agentContracts.filter(c => c.status === 'signed');
  const pendingContracts = agentContracts.filter(c => c.status === 'sent');
  const expiredContracts = agentContracts.filter(c => c.status === 'expired' || c.status === 'cancelled');
  
  const handleSendEmail = async (contractId: string) => {
    setIsLoading(contractId);
    
    // Find the contract and vendor
    const contract = agentContracts.find(c => c.id === contractId);
    if (!contract) return;
    
    try {
      await sendContractEmail(contract.vendorName, contract.id, contract.title);
      toast.success(`Contract sent to ${contract.vendorName}`);
    } catch (error) {
      toast.error('Failed to send contract');
    } finally {
      setIsLoading(null);
    }
  };
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <p className="text-muted-foreground">Manage your contracts with vendors</p>
          </div>
          <Button onClick={() => navigate('/agent/contracts/new')}>
            <Plus className="mr-2 h-4 w-4" />
            New Contract
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{draftContracts.length}</CardTitle>
              <CardDescription>Draft</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => navigate('/agent/contracts/new')}>
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
              <Button variant="outline" className="w-full" onClick={() => navigate('/agent/contracts?filter=active')}>
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
              <Button variant="outline" className="w-full" onClick={() => navigate('/agent/contracts?filter=expired')}>
                View Expired
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Contracts</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentContracts.length > 0 ? (
                agentContracts.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract} 
                    onSendEmail={contract.status === 'draft' ? () => handleSendEmail(contract.id) : undefined}
                    isLoading={isLoading === contract.id}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No contracts found. Create your first contract.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="draft" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftContracts.length > 0 ? (
                draftContracts.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract} 
                    onSendEmail={() => handleSendEmail(contract.id)}
                    isLoading={isLoading === contract.id}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No draft contracts found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingContracts.length > 0 ? (
                pendingContracts.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract} 
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No pending contracts found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeContracts.length > 0 ? (
                activeContracts.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract} 
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No active contracts found.
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="expired" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {expiredContracts.length > 0 ? (
                expiredContracts.map(contract => (
                  <ContractCard 
                    key={contract.id} 
                    contract={contract} 
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No expired contracts found.
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AgentContracts;
