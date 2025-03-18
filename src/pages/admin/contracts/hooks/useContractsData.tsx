
import { useState, useEffect } from 'react';
import { getContracts, getAgents, getVendors, deleteContract } from '@/api/api';
import { Agent, Contract, Vendor } from '@/types';
import { toast } from 'sonner';

export const useContractsData = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [contractsData, agentsData, vendorsData] = await Promise.all([
          getContracts(),
          getAgents(),
          getVendors()
        ]);
        
        setContracts(contractsData);
        setAgents(agentsData);
        setVendors(vendorsData);
      } catch (error) {
        toast.error('Failed to load contracts data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleDeleteContract = async (contract: Contract) => {
    try {
      await deleteContract(contract.id);
      setContracts(contracts.filter(c => c.id !== contract.id));
      toast.success('Contract deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contract');
      console.error(error);
    }
  };
  
  return {
    contracts,
    agents,
    vendors,
    isLoading,
    handleDeleteContract
  };
};
