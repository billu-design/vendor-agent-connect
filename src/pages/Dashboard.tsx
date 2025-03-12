import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContractCard } from "@/components/shared/ContractCard";
import { BarChart, FileText, Users, Building2, TrendingUp, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalContracts: 0,
    activeContracts: 0,
    totalAgents: 0,
    totalVendors: 0,
    totalValue: 0,
    pendingContracts: 0,
    recentContracts: [],
  });

  const isAdmin = user?.role === "admin";

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/stats");
        setDashboardData(response.data);
      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Send contract email
  const handleSendEmail = async (contractId: string) => {
    setIsLoading(true);
    try {
      await axios.post(`/api/contracts/${contractId}/send`);
      toast.success("Contract sent successfully.");
    } catch (error) {
      toast.error("Failed to send contract.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <p>Loading dashboard...</p>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          {!isAdmin && (
            <Button onClick={() => navigate("/agent/contracts/new")}>
              <FileText className="mr-2 h-4 w-4" />
              New Contract
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard title="Total Contracts" value={dashboardData.totalContracts} />
          <DashboardCard title="Total Value" value={formatCurrency(dashboardData.totalValue)} />
          <DashboardCard title="Pending Contracts" value={dashboardData.pendingContracts} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Recent Contracts</TabsTrigger>
            {isAdmin && <TabsTrigger value="performance">Performance</TabsTrigger>}
          </TabsList>

          <TabsContent value="contracts" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.recentContracts.length > 0 ? (
                dashboardData.recentContracts.map((contract) => (
                  <ContractCard
                    key={contract.id}
                    contract={contract}
                    onSendEmail={!isAdmin && contract.status === "draft" ? () => handleSendEmail(contract.id) : undefined}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-muted-foreground">No contracts found.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

// DashboardCard Component
const DashboardCard = ({ title, value }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default Dashboard;
