import { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, FileText, Download, Calendar, Filter } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const AdminReports = () => {
  const [contracts, setContracts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractsRes, agentsRes, vendorsRes] = await Promise.all([
          axios.get("/api/contracts"),
          axios.get("/api/agents"),
          axios.get("/api/vendors"),
        ]);

        setContracts(contractsRes.data);
        setAgents(agentsRes.data);
        setVendors(vendorsRes.data);
      } catch (error) {
        setError("Failed to load reports data.");
        toast.error("Error fetching reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>{error}</p>;

  // Calculate summary statistics
  const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
  const avgContractValue = totalValue / contracts.length || 0;

  // Generate data for the charts
  const statusData = [
    { name: "Signed", value: contracts.filter((c) => c.status === "signed").length },
    { name: "Draft", value: contracts.filter((c) => c.status === "draft").length },
    { name: "Sent", value: contracts.filter((c) => c.status === "sent").length },
    { name: "Expired", value: contracts.filter((c) => c.status === "expired").length },
    { name: "Cancelled", value: contracts.filter((c) => c.status === "cancelled").length },
  ];

  // Create agent performance data
  const agentPerformance = agents.map((agent) => ({
    name: agent.name.split(" ")[0], // Just use first name to keep chart clean
    contracts: agent.contractsCount,
  }));

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Analytics and reporting dashboard</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{contracts.length}</CardTitle>
              <CardDescription>Total Contracts</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{formatCurrency(totalValue)}</CardTitle>
              <CardDescription>Total Contract Value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Avg. contract:</span>
                <span className="font-medium">{formatCurrency(avgContractValue)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{agents.length}</CardTitle>
              <CardDescription>Total Agents</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{vendors.length}</CardTitle>
              <CardDescription>Total Vendors</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Status Breakdown</CardTitle>
                <CardDescription>Distribution by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Contracts" fill="#6366f1" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Contracts by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={agentPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="contracts" name="Contracts" fill="#10b981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AdminReports;
