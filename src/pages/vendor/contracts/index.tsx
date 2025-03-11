
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { sampleContracts } from "@/data/sampleData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contract } from "@/types";
import { ContractCard } from "@/components/shared/ContractCard";

export default function VendorContracts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter contracts relevant to this vendor
  const vendorContracts = sampleContracts.filter(
    (contract) => 
      contract.vendorName.toLowerCase() === user?.name.toLowerCase() || 
      contract.vendorId === user?.id
  );
  
  const filteredContracts = activeTab === "all" 
    ? vendorContracts 
    : vendorContracts.filter((contract) => contract.status === activeTab);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Contracts</h1>
        <p className="text-muted-foreground">Manage your contracts with agents</p>
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
    </AppLayout>
  );
}
