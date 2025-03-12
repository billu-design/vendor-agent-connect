import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Contract } from "@/types";
import { Eye, FileText, XCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ContractActionsProps {
  contract: Contract;
  onStatusUpdate: (updatedContract: Contract) => void;
}

export const ContractActions = ({ contract, onStatusUpdate }: ContractActionsProps) => {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewDetails = () => {
    navigate(`/vendor/contracts/${contract.id}`);
  };

  const updateContractStatus = async (status: "signed" | "cancelled") => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`/api/contracts/${contract.id}`, { status });
      onStatusUpdate(response.data);
      toast.success(`Contract ${status === "signed" ? "approved" : "rejected"}`);
    } catch (error) {
      toast.error("Failed to update contract status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex space-x-2 justify-end">
      <Button variant="ghost" size="icon" onClick={handleViewDetails}>
        <Eye className="h-4 w-4" />
      </Button>

      {contract.status === "sent" && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-500 hover:text-green-600 hover:bg-green-50"
            onClick={() => updateContractStatus("signed")}
            disabled={isUpdating}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => updateContractStatus("cancelled")}
            disabled={isUpdating}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </>
      )}

      {contract.status === "signed" && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => window.open(`/contracts/${contract.document}`, "_blank")}
        >
          <FileText className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
