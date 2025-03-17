
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { AddServiceDialog } from './AddServiceDialog';

interface Service {
  id: string;
  name: string;
  description: string;
}

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
  
  const handleAddService = (name: string, description: string) => {
    const newService: Service = {
      id: (services.length + 1).toString(),
      name,
      description
    };
    
    setServices([...services, newService]);
    setIsAddDialogOpen(false);
    toast.success(`${name} service has been added`);
  };
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <AddServiceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddService={handleAddService}
        />
      </div>
    </AppLayout>
  );
};

export default AdminServices;
