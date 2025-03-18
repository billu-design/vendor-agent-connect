
import { useState, useCallback } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/shared/DataTable";
import { ContractsColumns } from "./ContractsColumns";
import { useContractsData } from "./hooks/useContractsData";
import { ContractActions } from "./ContractActions";
import { useNavigate } from "react-router-dom";
import { FilePlus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Contract } from "@/types";

const Contracts = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    agentId: "",
    vendorId: "",
    minValue: 0,
    maxValue: 100000,
    dateRange: "all"
  });
  
  const { contracts, isLoading, agents, vendors, handleDeleteContract } = useContractsData();
  
  // Apply filters to contracts
  const filteredContracts = contracts.filter(contract => {
    // Search term filter
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = !filterOptions.status || contract.status === filterOptions.status;
    
    // Agent filter
    const matchesAgent = !filterOptions.agentId || contract.agentId === filterOptions.agentId;
    
    // Vendor filter
    const matchesVendor = !filterOptions.vendorId || contract.vendorId === filterOptions.vendorId;
    
    // Value range filter
    const matchesValue = contract.value >= filterOptions.minValue && contract.value <= filterOptions.maxValue;
    
    // Date range filter
    let matchesDate = true;
    const contractDate = new Date(contract.createdAt);
    const now = new Date();
    
    if (filterOptions.dateRange === "lastWeek") {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = contractDate >= lastWeek;
    } else if (filterOptions.dateRange === "lastMonth") {
      const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = contractDate >= lastMonth;
    } else if (filterOptions.dateRange === "last3Months") {
      const last3Months = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesDate = contractDate >= last3Months;
    }
    
    return matchesSearch && matchesStatus && matchesAgent && matchesVendor && matchesValue && matchesDate;
  });
  
  // Count active filters
  const countActiveFilters = () => {
    let count = 0;
    if (filterOptions.status) count++;
    if (filterOptions.agentId) count++;
    if (filterOptions.vendorId) count++;
    if (filterOptions.minValue > 0 || filterOptions.maxValue < 100000) count++;
    if (filterOptions.dateRange !== "all") count++;
    return count;
  };
  
  const activeFilterCount = countActiveFilters();
  
  // Reset all filters
  const handleResetFilters = () => {
    setFilterOptions({
      status: "",
      agentId: "",
      vendorId: "",
      minValue: 0,
      maxValue: 100000,
      dateRange: "all"
    });
    toast.success("Filters have been reset");
  };
  
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contracts</h1>
            <p className="text-muted-foreground">Manage and track all contracts</p>
          </div>
          <Button onClick={() => navigate("/admin/contracts/new")}>
            <FilePlus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{contracts.filter(c => c.status === "signed").length}</CardTitle>
              <CardDescription>Active Contracts</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{contracts.filter(c => c.status === "sent").length}</CardTitle>
              <CardDescription>Pending Approval</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">${contracts.reduce((total, contract) => total + (contract.status === "signed" ? contract.value : 0), 0).toLocaleString()}</CardTitle>
              <CardDescription>Total Value</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Contracts</CardTitle>
            <CardDescription>View and manage all contract details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-72">
                <Input 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-3"
                />
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-1">{activeFilterCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Contracts</SheetTitle>
                    <SheetDescription>
                      Apply filters to narrow down the contracts list
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 py-6">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={filterOptions.status} 
                        onValueChange={(value) => setFilterOptions({...filterOptions, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="signed">Signed</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Agent</Label>
                      <Select 
                        value={filterOptions.agentId} 
                        onValueChange={(value) => setFilterOptions({...filterOptions, agentId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All agents" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          {agents.map(agent => (
                            <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Vendor</Label>
                      <Select 
                        value={filterOptions.vendorId} 
                        onValueChange={(value) => setFilterOptions({...filterOptions, vendorId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All vendors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All</SelectItem>
                          {vendors.map(vendor => (
                            <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Contract Value</Label>
                        <span className="text-sm text-muted-foreground">
                          {formatCurrency(filterOptions.minValue)} - {formatCurrency(filterOptions.maxValue)}
                        </span>
                      </div>
                      <Slider 
                        value={[filterOptions.minValue, filterOptions.maxValue]}
                        min={0}
                        max={100000}
                        step={1000}
                        onValueChange={(value) => setFilterOptions({
                          ...filterOptions, 
                          minValue: value[0], 
                          maxValue: value[1]
                        })}
                        className="py-4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Range</Label>
                      <Select 
                        value={filterOptions.dateRange} 
                        onValueChange={(value) => setFilterOptions({...filterOptions, dateRange: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All time</SelectItem>
                          <SelectItem value="lastWeek">Last week</SelectItem>
                          <SelectItem value="lastMonth">Last month</SelectItem>
                          <SelectItem value="last3Months">Last 3 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4" 
                      onClick={handleResetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            <DataTable 
              columns={ContractsColumns} 
              data={filteredContracts}
              isLoading={isLoading}
              actions={(contract: Contract) => (
                <ContractActions 
                  contract={contract} 
                  onViewContract={(contract) => navigate(`/admin/contracts/${contract.id}`)}
                  onDeleteContract={handleDeleteContract}
                />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Contracts;
