
import { Button } from '@/components/ui/button';
import { Vendor } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VendorActionsProps {
  vendor: Vendor;
  onDelete: (vendor: Vendor) => void;
}

export const VendorActions = ({ vendor, onDelete }: VendorActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2 justify-end">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(`/admin/vendors/edit/${vendor.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(vendor)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
