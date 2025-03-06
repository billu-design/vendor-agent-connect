
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
  const { user } = useAuth();
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
    pendingContracts: sampleContracts.filter(c => c.status === 'draft' || c.status === 'sent').length,
  };
  
  // Get recent contracts
  const recentContracts = [...sampleContracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get agent's contracts if the user is an agent
  const agentContracts = isAdmin 
    ? recentContracts 
    : sampleContracts.filter(contract => contract.agentName === user?.name);
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {!isAdmin && (
            <Button onClick={() => navigate('/agent/contracts/new')}>
              <FileText className="mr-2 h-4 w-4" />
              New Contract
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-primary"></div>
            <CardHeader className="pb-2">
              <CardDescription>Total Contracts</CardDescription>
              <CardTitle className="text-3xl">{isAdmin ? stats.totalContracts : agentContracts.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Active contracts:</span>
                <span className="font-medium">{isAdmin ? stats.activeContracts : agentContracts.filter(c => c.status === 'signed').length}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-1 bg-green-500"></div>
            <CardHeader className="pb-2">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-3xl">
                {formatCurrency(isAdmin ? stats.totalValue : agentContracts.reduce((sum, c) => sum + c.value, 0))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {isAdmin ? 'Average contract value:' : 'Avg. contract:'}
                </span>
                <span className="font-medium">
                  {formatCurrency(isAdmin 
                    ? stats.totalValue / stats.totalContracts 
                    : agentContracts.reduce((sum, c) => sum + c.value, 0) / agentContracts.length || 0
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-1 bg-yellow-500"></div>
            <CardHeader className="pb-2">
              <CardDescription>{isAdmin ? 'Total Agents/Vendors' : 'Pending Contracts'}</CardDescription>
              <CardTitle className="text-3xl">
                {isAdmin ? `${stats.totalAgents}/${stats.totalVendors}` : agentContracts.filter(c => c.status === 'draft' || c.status === 'sent').length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  {isAdmin ? 'Pending contracts:' : 'Draft contracts:'}
                </span>
                <span className="font-medium">
                  {isAdmin ? stats.pendingContracts : agentContracts.filter(c => c.status === 'draft').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Recent Contracts</TabsTrigger>
            {isAdmin && <TabsTrigger value="performance">Performance</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {isAdmin ? (
                    <>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/agents')}>
                        <Users className="mr-2 h-4 w-4" /> Manage Agents
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/vendors')}>
                        <Building2 className="mr-2 h-4 w-4" /> Manage Vendors
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/contracts')}>
                        <FileText className="mr-2 h-4 w-4" /> View All Contracts
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/admin/reports')}>
                        <BarChart className="mr-2 h-4 w-4" /> View Reports
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/agent/contracts/new')}>
                        <FileText className="mr-2 h-4 w-4" /> Create New Contract
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/agent/contracts')}>
                        <FileText className="mr-2 h-4 w-4" /> View All Contracts
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/agent/vendors')}>
                        <Building2 className="mr-2 h-4 w-4" /> View Vendors
                      </Button>
                      <Button className="w-full justify-start" variant="outline" onClick={() => navigate('/agent/messages')}>
                        <TrendingUp className="mr-2 h-4 w-4" /> Message Center
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CircleDollarSign className="h-10 w-10 text-green-500 mr-4" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Value</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(isAdmin ? stats.totalValue : agentContracts.reduce((sum, c) => sum + c.value, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-10 w-10 text-primary mr-4" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Contracts</p>
                          <p className="text-lg font-semibold">{isAdmin ? stats.totalContracts : agentContracts.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isAdmin ? (
                          <>
                            <Users className="h-10 w-10 text-yellow-500 mr-4" />
                            <div>
                              <p className="text-sm text-muted-foreground">Total Agents</p>
                              <p className="text-lg font-semibold">{stats.totalAgents}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Building2 className="h-10 w-10 text-yellow-500 mr-4" />
                            <div>
                              <p className="text-sm text-muted-foreground">Vendors Connected</p>
                              <p className="text-lg font-semibold">
                                {new Set(agentContracts.map(c => c.vendorId)).size}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(isAdmin ? recentContracts : agentContracts.slice(0, 6)).map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract} 
                  onSendEmail={!isAdmin && contract.status === 'draft' ? () => handleSendEmail(contract.id) : undefined}
                />
              ))}
              
              {(isAdmin ? recentContracts : agentContracts).length === 0 && (
                <div className="col-span-3 py-8 text-center text-muted-foreground">
                  No contracts found.
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={() => navigate(isAdmin ? '/admin/contracts' : '/agent/contracts')}>
                View All Contracts
              </Button>
            </div>
          </TabsContent>
          
          {isAdmin && (
            <TabsContent value="performance" className="space-y-4">
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
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
