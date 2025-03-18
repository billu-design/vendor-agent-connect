
import { useState, useCallback } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AddServiceDialog } from './AddServiceDialog';
import { EditServiceDialog } from './EditServiceDialog';
import { DataTable } from '@/components/shared/DataTable';
import { ServiceColumns } from './ServiceColumns';
import { ServiceActions } from './ServiceActions';
import { Service } from '@/types';

const sampleServices: Service[] = [
  {
    id: '1',
    name: 'IT Support',
    description: 'Comprehensive IT support and maintenance services for businesses of all sizes.'
  },
  {
    id: '2',
    name: 'Cleaning Services',
    description: 'Professional cleaning and janitorial services for commercial properties.'
  },
  {
    id: '3',
    name: 'Security Services',
    description: 'Physical and digital security solutions for protecting assets and personnel.'
  }
];

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>(sampleServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const handleAddService = useCallback((name: string, description: string) => {
    const newService: Service = {
      id: (services.length + 1).toString(),
      name,
      description
    };
    
    setServices(prev => [...prev, newService]);
    setIsAddDialogOpen(false);
    toast.success(`${name} service has been added`);
  }, [services.length]);
  
  const handleEditService = useCallback((service: Service) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  }, []);
  
  const handleSaveService = useCallback((updatedService: Service) => {
    setServices(prev => 
      prev.map(service => service.id === updatedService.id ? updatedService : service)
    );
    setIsEditDialogOpen(false);
    setSelectedService(null);
    toast.success(`${updatedService.name} has been updated`);
  }, []);
  
  const handleDeleteService = useCallback((service: Service) => {
    setServices(prev => prev.filter(s => s.id !== service.id));
    toast.success(`${service.name} has been deleted`);
  }, []);
  
  const renderActions = useCallback((service: any) => (
    <ServiceActions 
      service={service as Service} 
      onEdit={handleEditService} 
      onDelete={handleDeleteService}
    />
  ), [handleEditService, handleDeleteService]);
  
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
        
        <DataTable 
          columns={ServiceColumns} 
          data={services}
          actions={renderActions}
        />
        
        {isAddDialogOpen && (
          <AddServiceDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddService={handleAddService}
          />
        )}
        
        {isEditDialogOpen && selectedService && (
          <EditServiceDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleSaveService}
            service={selectedService}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default AdminServices;
