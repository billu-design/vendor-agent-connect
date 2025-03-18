
import { Button } from '@/components/ui/button';
import { Service } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ServiceActionsProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export const ServiceActions = ({ service, onEdit, onDelete }: ServiceActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    onDelete(service);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex space-x-2 justify-end">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit(service)}
          title="Edit Service"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleOpenDeleteDialog}
          title="Delete Service"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{service.name}" service. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
