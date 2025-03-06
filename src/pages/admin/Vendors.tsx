
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { sampleVendors } from '@/data/sampleData';
import { Vendor } from '@/types';
import { Edit, Trash2, Building2 } from 'lucide-react';
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

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    email: '',
    phone: '',
    location: '',
    type: '',
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
      key: 'type',
      header: 'Type',
      sortable: true,
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (value: string) => <StatusBadge status={value} />,
      sortable: true,
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      render: (value: string) => formatDate(value),
      sortable: true,
    },
  ];
  
  const handleDelete = (vendor: Vendor) => {
    // This is just a demo, so we'll just filter the vendor out
    setVendors(vendors.filter(v => v.id !== vendor.id));
    toast.success(`${vendor.name} has been removed`);
  };
  
  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email || !newVendor.phone || !newVendor.location || !newVendor.type) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const vendor: Vendor = {
      id: (vendors.length + 1).toString(),
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone,
      location: newVendor.location,
      type: newVendor.type,
      status: newVendor.status as 'active' | 'inactive', // This line had the error
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    setVendors([...vendors, vendor]);
    setIsAddDialogOpen(false);
    setNewVendor({
      name: '',
      email: '',
      phone: '',
      location: '',
      type: '',
      status: 'active',
    });
    
    toast.success(`${vendor.name} has been added as a vendor`);
  };
  
  const actions = (vendor: Vendor) => (
    <div className="flex space-x-2 justify-end">
      <Button variant="ghost" size="icon">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Building2 className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>
        
        <DataTable columns={columns} data={vendors} actions={actions} />
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddVendor}>Add Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Vendors;
