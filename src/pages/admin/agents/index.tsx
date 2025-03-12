import { useState, useEffect } from 'react';
import axios from 'axios';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { Agent } from '@/types';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AgentColumns } from './AgentColumns';
import { AgentActions } from './AgentActions';
import { AddAgentDialog } from './AddAgentDialog';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('/api/agents');
        setAgents(response.data);
      } catch (error) {
        setError('Failed to load agents.');
        toast.error('Error fetching agents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Delete an agent
  const handleDelete = async (agent: Agent) => {
    if (!window.confirm(`Are you sure you want to delete ${agent.name}?`)) return;

    try {
      await axios.delete(`/api/agents/${agent.id}`);
      setAgents((prev) => prev.filter((a) => a.id !== agent.id));
      toast.success(`${agent.name} has been removed`);
    } catch (error) {
      toast.error('Failed to delete agent. Please try again.');
    }
  };

  // Add a new agent
  const handleAddAgent = async (newAgentData: Omit<Agent, 'id' | 'contractsCount' | 'joinDate'>) => {
    try {
      const response = await axios.post('/api/agents', {
        ...newAgentData,
      });

      setAgents((prev) => [...prev, response.data]);
      setIsAddDialogOpen(false);
      toast.success(`${response.data.name} has been added as an agent`);
    } catch (error) {
      toast.error('Error adding agent. Please try again.');
    }
  };

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Agent
          </Button>
        </div>

        <DataTable 
          columns={AgentColumns} 
          data={agents} 
          actions={(agent) => <AgentActions agent={agent} onDelete={handleDelete} />}
        />

        <AddAgentDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddAgent={handleAddAgent}
        />
      </div>
    </AppLayout>
  );
};

export default Agents;
