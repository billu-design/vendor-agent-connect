
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vendor } from '@/types';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
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

// Service types available for selection
const SERVICE_TYPES = [
  'IT Consulting',
  'Software Development',
  'Cloud Services',
  'Security Services',
  'Hardware Supply',
  'Network Infrastructure',
  'Managed IT Services',
  'Data Analytics',
  'Database Management',
  'Web Development',
  'Mobile App Development',
  'AI and Machine Learning',
  'DevOps Services',
  'QA Testing',
  'Technical Support'
];

export const AddVendorDialog = ({ open, onOpenChange, onAddVendor }: AddVendorDialogProps) => {
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    location: '',
    type: '',
    status: 'active',
    serviceTypes: []
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, service]);
    } else {
      setSelectedServices(selectedServices.filter(s => s !== service));
    }
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.companyName || !newVendor.email || !newVendor.phone || !newVendor.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (!validatePhone(newVendor.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service type');
      return;
    }
    
    const vendorType = selectedServices.join(', ');
    
    onAddVendor({
      name: newVendor.name,
      companyName: newVendor.companyName,
      email: newVendor.email,
      phone: newVendor.phone,
      location: newVendor.location,
      type: vendorType,
      status: newVendor.status as 'active' | 'inactive',
      serviceTypes: selectedServices
    });
    
    // Reset form
    setNewVendor({
      name: '',
      companyName: '',
      email: '',
      phone: '',
      location: '',
      type: '',
      status: 'active',
    });
    setSelectedServices([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Vendor</DialogTitle>
          <DialogDescription>
            Enter the details of the new vendor below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={newVendor.companyName || ''}
                onChange={(e) => setNewVendor({ ...newVendor, companyName: e.target.value })}
                placeholder="Company Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Vendor Name</Label>
              <Input
                id="name"
                value={newVendor.name}
                onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                placeholder="Vendor Name"
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
              <Label htmlFor="phone">Phone (10 digits)</Label>
              <Input
                id="phone"
                value={newVendor.phone}
                onChange={(e) => {
                  // Only allow digits and max 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setNewVendor({ ...newVendor, phone: value });
                }}
                placeholder="Phone Number"
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
              <Label>Service Types</Label>
              <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                {SERVICE_TYPES.map(service => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service}`} 
                      checked={selectedServices.includes(service)}
                      onCheckedChange={(checked) => handleServiceChange(service, checked === true)}
                    />
                    <label 
                      htmlFor={`service-${service}`}
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
              {selectedServices.length === 0 && (
                <p className="text-sm text-destructive">Please select at least one service type</p>
              )}
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
        </ScrollArea>
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
