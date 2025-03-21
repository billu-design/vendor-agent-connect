import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractCard } from '@/components/shared/ContractCard';
import { BarChart, FileText, Users, Building2, TrendingUp, CircleDollarSign } from 'lucide-react';
import { sampleContracts, sampleAgents, sampleVendors } from '@/data/sampleData';
import { formatCurrency, sendContractEmail } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
const Dashboard = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';
  const handleSendEmail = async (contractId: string) => {
    setIsLoading(contractId);

    // Find the contract
    const contract = sampleContracts.find(c => c.id === contractId);
    if (!contract) return;

    // Find the vendor
    const vendor = sampleVendors.find(v => v.id === contract.vendorId);
    if (!vendor) return;
    try {
      await sendContractEmail(vendor.email, contract.id, contract.title);
      toast.success(`Contract sent to ${vendor.name}`);
    } catch (error) {
      toast.error('Failed to send contract');
    } finally {
      setIsLoading(null);
    }
  };

  // Get counts and sums for dashboard stats
  const stats = {
    totalContracts: sampleContracts.length,
    activeContracts: sampleContracts.filter(c => c.status === 'signed').length,
    totalAgents: sampleAgents.length,
    totalVendors: sampleVendors.length,
    totalValue: sampleContracts.reduce((sum, contract) => sum + contract.value, 0),
    pendingContracts: sampleContracts.filter(c => c.status === 'draft' || c.status === 'sent').length
  };

  // Get recent contracts
  const recentContracts = [...sampleContracts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);

  // Get vendor's contracts
  const vendorContracts = isAdmin ? recentContracts : sampleContracts.filter(contract => contract.vendorName === user?.name);
  return <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-primary"></div>
            <CardHeader className="pb-2">
              <CardDescription>Total Contracts</CardDescription>
              <CardTitle className="text-3xl">{isAdmin ? stats.totalContracts : vendorContracts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Active contracts:</span>
                <span className="font-medium">{isAdmin ? stats.activeContracts : vendorContracts.filter(c => c.status === 'signed').length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(isAdmin ? stats.totalValue : vendorContracts.reduce((sum, c) => sum + c.value, 0))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {isAdmin ? 'Average contract value:' : 'Avg. contract:'}
                </span>
                <span className="font-medium">
                  {formatCurrency(isAdmin ? stats.totalValue / stats.totalContracts : vendorContracts.reduce((sum, c) => sum + c.value, 0) / vendorContracts.length || 0)}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-1 bg-yellow-500"></div>
            <CardHeader className="pb-2">
              <CardDescription>{isAdmin ? 'Total Agents/Vendors' : 'Pending Contracts'}</CardDescription>
              <CardTitle className="text-3xl">
                {isAdmin ? `${stats.totalAgents}/${stats.totalVendors}` : vendorContracts.filter(c => c.status === 'draft' || c.status === 'sent').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {isAdmin ? 'Pending contracts:' : 'Draft contracts:'}
                </span>
                <span className="font-medium">
                  {isAdmin ? stats.pendingContracts : vendorContracts.filter(c => c.status === 'draft').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            
            <TabsTrigger value="contracts">Recent Contracts</TabsTrigger>
            {isAdmin && <TabsTrigger value="performance">Performance</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isAdmin ? recentContracts : vendorContracts.slice(0, 6)).map(contract => <ContractCard key={contract.id} contract={contract} onSendEmail={contract.status === 'draft' ? () => handleSendEmail(contract.id) : undefined} />)}
              
              {(isAdmin ? recentContracts : vendorContracts).length === 0 && <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No contracts found.
                </div>}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => navigate(isAdmin ? '/admin/contracts' : '/vendor/contracts')}>
                View All Contracts
              </Button>
            </div>
          </TabsContent>
          
          {isAdmin && <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Overview of key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Performance charts and statistics would appear here.</p>
                      <p className="text-sm mt-2">This is placeholder content for the demo.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>}
        </Tabs>
      </div>
    </AppLayout>;
};
export default Dashboard;