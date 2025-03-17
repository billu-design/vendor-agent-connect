
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/DataTable';
import { sampleVendors } from '@/data/sampleData';
import { Vendor } from '@/types';
import { Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { VendorColumns } from './VendorColumns';
import { VendorActions } from './VendorActions';
import { AddVendorDialog } from './AddVendorDialog';

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>(sampleVendors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const handleDelete = (vendor: Vendor) => {
    // This is just a demo, so we'll just filter the vendor out
    setVendors(vendors.filter(v => v.id !== vendor.id));
    toast.success(`${vendor.name} has been removed`);
  };
  
  const handleAddVendor = (newVendorData: Omit<Vendor, 'id' | 'joinDate'>) => {
    const vendor: Vendor = {
      id: (vendors.length + 1).toString(),
      name: newVendorData.name,
      email: newVendorData.email,
      phone: newVendorData.phone,
      location: newVendorData.location,
      type: newVendorData.type,
      status: newVendorData.status,
      joinDate: new Date().toISOString().split('T')[0],
    };
    
    setVendors([...vendors, vendor]);
    setIsAddDialogOpen(false);
    toast.success(`${vendor.name} has been added as a vendor`);
  };
  
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
        
        <DataTable 
          columns={VendorColumns} 
          data={vendors} 
          actions={(vendor) => <VendorActions vendor={vendor} onDelete={handleDelete} />}
        />
        
        <AddVendorDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddVendor={handleAddVendor}
        />
      </div>
    </AppLayout>
  );
};

export default Vendors;
