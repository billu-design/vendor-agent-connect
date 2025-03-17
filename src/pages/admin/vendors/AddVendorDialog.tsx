
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vendor } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVendor: (vendor: Omit<Vendor, 'id' | 'joinDate'>) => void;
}

export const AddVendorDialog = ({ open, onOpenChange, onAddVendor }: AddVendorDialogProps) => {
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: '',
    status: 'active',
  });

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email || !newVendor.phone || !newVendor.location || !newVendor.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    onAddVendor({
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone,
      location: newVendor.location,
      type: newVendor.type,
      status: newVendor.status as 'active' | 'inactive',
    });
    
    setNewVendor({
      name: '',
      email: '',
      phone: '',
      location: '',
      type: '',
      status: 'active',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Enter the details of the new vendor below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={newVendor.name}
              onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
              placeholder="Company Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newVendor.email}
              onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
              placeholder="Email Address"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={newVendor.phone}
              onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
              placeholder="Phone Number"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Business Type</Label>
            <Input
              id="type"
              value={newVendor.type}
              onChange={(e) => setNewVendor({ ...newVendor, type: e.target.value })}
              placeholder="Business Type"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={newVendor.location}
              onChange={(e) => setNewVendor({ ...newVendor, location: e.target.value })}
              placeholder="City, State"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={newVendor.status}
              onValueChange={(value: 'active' | 'inactive') => setNewVendor({ ...newVendor, status: value })}
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
          <Button onClick={handleAddVendor}>Add Vendor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
