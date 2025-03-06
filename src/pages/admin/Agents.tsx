
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { sampleAgents } from '@/data/sampleData';
import { Agent } from '@/types';
import { Edit, Trash2, UserPlus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    region: '',
    status: 'active',
  });
  
  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'region',
      header: 'Region',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
      sortable: true,
    },
    {
      key: 'contractsCount',
      header: 'Contracts',
      sortable: true,
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
  ];
  
  const handleDelete = (agent: Agent) => {
    // This is just a demo, so we'll just filter the agent out
    setAgents(agents.filter(a => a.id !== agent.id));
    toast.success(`${agent.name} has been removed`);
  };
  
  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.email || !newAgent.phone || !newAgent.region) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const agent: Agent = {
      id: (agents.length + 1).toString(),
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      region: newAgent.region,
      status: newAgent.status as 'active' | 'inactive', // This line had the error
      contractsCount: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    setAgents([...agents, agent]);
    setIsAddDialogOpen(false);
    setNewAgent({
      name: '',
      email: '',
      phone: '',
      region: '',
      status: 'active',
    });
    
    toast.success(`${agent.name} has been added as an agent`);
  };
  
  const actions = (agent: Agent) => (
    <div className="flex space-x-2 justify-end">
      <Button variant="ghost" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDelete(agent)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
  
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
        
        <DataTable columns={columns} data={agents} actions={actions} />
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                Enter the details of the new agent below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  placeholder="Full Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  placeholder="Email Address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                  placeholder="Phone Number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={newAgent.region}
                  onChange={(e) => setNewAgent({ ...newAgent, region: e.target.value })}
                  placeholder="Region/Territory"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newAgent.status}
                  onValueChange={(value: 'active' | 'inactive') => setNewAgent({ ...newAgent, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAgent}>Add Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Agents;
