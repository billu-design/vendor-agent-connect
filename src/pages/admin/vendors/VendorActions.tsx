import { Button } from "@/components/ui/button";
import { Vendor } from "@/types";
import { Edit, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface VendorActionsProps {
  vendor: Vendor;
  onDeleteSuccess: (vendorId: string) => void; // Callback to update UI after deletion
}

export const VendorActions = ({ vendor, onDeleteSuccess }: VendorActionsProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${vendor.name}?`)) return;

    try {
      await axios.delete(`/api/vendors/${vendor.id}`);
      toast.success(`Vendor ${vendor.name} deleted successfully.`);
      onDeleteSuccess(vendor.id); // Update UI
    } catch (error) {
      toast.error("Failed to delete vendor. Please try again.");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="flex space-x-2 justify-end">
      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/vendors/${vendor.id}`)} title="View Details">
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/vendors/edit/${vendor.id}`)} title="Edit Vendor">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete Vendor">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
