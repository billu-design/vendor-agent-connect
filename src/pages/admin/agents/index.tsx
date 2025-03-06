
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { sampleAgents } from '@/data/sampleData';
import { Agent } from '@/types';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { AgentColumns } from './AgentColumns';
import { AgentActions } from './AgentActions';
import { AddAgentDialog } from './AddAgentDialog';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleDelete = (agent: Agent) => {
    setAgents(agents.filter(a => a.id !== agent.id));
    toast.success(`${agent.name} has been removed`);
  };
  
  const handleAddAgent = (newAgentData: Omit<Agent, 'id' | 'contractsCount' | 'joinDate'>) => {
    const agent: Agent = {
      id: (agents.length + 1).toString(),
      name: newAgentData.name,
      email: newAgentData.email,
      phone: newAgentData.phone,
      region: newAgentData.region,
      status: newAgentData.status,
      contractsCount: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    setAgents([...agents, agent]);
    setIsAddDialogOpen(false);
    toast.success(`${agent.name} has been added as an agent`);
  };
  
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
