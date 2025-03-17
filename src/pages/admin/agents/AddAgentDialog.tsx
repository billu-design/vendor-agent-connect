
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
  const [newAgent, setNewAgent] = useState<Partial<Agent & { addressLine1: string, addressLine2: string }>>({
    name: '',
    email: '',
    phone: '',
    region: '',
    status: 'active',
    addressLine1: '',
    addressLine2: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!newAgent.name) newErrors.name = 'Name is required';
    if (!newAgent.email) newErrors.email = 'Email is required';
    
    if (!newAgent.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(newAgent.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    if (!newAgent.region) newErrors.region = 'Region is required';
    if (!newAgent.addressLine1) newErrors.addressLine1 = 'Address Line 1 is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Validate phone to only allow numbers
    if (id === 'phone' && value !== '' && !/^\d+$/.test(value)) {
      return;
    }
    
    setNewAgent({ ...newAgent, [id]: value });
    
    // Clear error when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' });
    }
  };

  const handleAddAgent = () => {
    if (validateForm()) {
      onAddAgent({
        name: newAgent.name!,
        email: newAgent.email!,
        phone: newAgent.phone!,
        region: newAgent.region!,
        status: newAgent.status as 'active' | 'inactive',
        address: `${newAgent.addressLine1}, ${newAgent.addressLine2 || ''}`.trim(),
      });
      
      setNewAgent({
        name: '',
        email: '',
        phone: '',
        region: '',
        status: 'active',
        addressLine1: '',
        addressLine2: '',
      });
      setErrors({});
    } else {
      toast.error('Please correct the errors in the form');
    }
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
            <Label htmlFor="name">Name*</Label>
            <Input
              id="name"
              value={newAgent.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              value={newAgent.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone* (10 digits)</Label>
            <Input
              id="phone"
              value={newAgent.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
              maxLength={10}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="addressLine1">Address Line 1*</Label>
            <Input
              id="addressLine1"
              value={newAgent.addressLine1}
              onChange={handleInputChange}
              placeholder="Street address"
              className={errors.addressLine1 ? "border-red-500" : ""}
            />
            {errors.addressLine1 && <p className="text-xs text-red-500">{errors.addressLine1}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input
              id="addressLine2"
              value={newAgent.addressLine2}
              onChange={handleInputChange}
              placeholder="Apt, suite, unit, etc. (optional)"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="region">Region*</Label>
            <Input
              id="region"
              value={newAgent.region}
              onChange={handleInputChange}
              placeholder="Region/Territory"
              className={errors.region ? "border-red-500" : ""}
            />
            {errors.region && <p className="text-xs text-red-500">{errors.region}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status*</Label>
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
