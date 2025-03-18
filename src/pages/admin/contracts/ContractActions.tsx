
import { Button } from '@/components/ui/button';
import { Contract } from '@/types';
import { Eye, Trash2, FileText } from 'lucide-react';
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
import { useState } from 'react';

interface ContractActionsProps {
  contract: Contract;
  onViewContract: (contract: Contract) => void;
  onDeleteContract: (contract: Contract) => void;
}

export const ContractActions = ({ contract, onViewContract, onDeleteContract }: ContractActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  return (
    <div className="flex space-x-2 justify-end">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onViewContract(contract)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setShowDeleteDialog(true)}
        title="Delete Contract"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the contract "{contract.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDeleteContract(contract)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
