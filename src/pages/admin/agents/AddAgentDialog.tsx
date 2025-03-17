
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Agent } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAgent: (agent: Omit<Agent, 'id' | 'contractsCount' | 'joinDate'>) => void;
}

export const AddAgentDialog = ({ open, onOpenChange, onAddAgent }: AddAgentDialogProps) => {
  const [newAgent, setNewAgent] = useState<Partial<Agent>>({
    name: '',
    email: '',
    phone: '',
    region: '',
    status: 'active',
  });

  const handleAddAgent = () => {
    if (!newAgent.name || !newAgent.email || !newAgent.phone || !newAgent.region) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    onAddAgent({
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      region: newAgent.region,
      status: newAgent.status as 'active' | 'inactive',
    });
    
    setNewAgent({
      name: '',
      email: '',
      phone: '',
      region: '',
      status: 'active',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddAgent}>Add Agent</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
