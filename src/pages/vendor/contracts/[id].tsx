import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Contract } from "@/types";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Download, FileText, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Separator } from "@/components/ui/separator";

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch contract details from API
  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await axios.get(`/api/contracts/${id}`);
        setContract(response.data);
      } catch (err) {
        setError("Failed to load contract details.");
        toast.error("Error fetching contract.");
        navigate("/vendor/contracts");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchContract();
    }
  }, [id, navigate]);

  // Update contract status
  const handleStatusUpdate = async (status: "signed" | "cancelled") => {
    if (!contract) return;

    setIsUpdating(true);
    try {
      await axios.put(`/api/contracts/${contract.id}`, { status });
      setContract({ ...contract, status });
      toast.success(`Contract ${status === "signed" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error("Failed to update contract status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p>Loading contract details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/contracts")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Contract Details</h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl">{contract?.title}</CardTitle>
            <StatusBadge status={contract?.status} />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Agent</h3>
                  <p className="text-lg">{contract?.agentName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Created On</h3>
                  <p className="text-lg">{new Date(contract?.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Contract Value</h3>
                  <p className="text-lg">${contract?.value.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Vendor</h3>
                  <p className="text-lg">{contract?.vendorName}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Expires On</h3>
                  <p className="text-lg">{new Date(contract?.expiresAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-2">Notes</h3>
              <p>{contract?.notes || "No additional notes provided."}</p>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" leftIcon={<FileText className="h-4 w-4" />}>
                View Contract Document
              </Button>
            </div>
          </CardContent>

          {/* Action Buttons for Sent Contracts */}
          {contract?.status === "sent" && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={isUpdating}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject Contract
              </Button>
              <Button onClick={() => handleStatusUpdate("signed")} disabled={isUpdating}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Contract
              </Button>
            </CardFooter>
          )}

          {/* Download Button for Signed Contracts */}
          {contract?.status === "signed" && (
            <CardFooter>
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Signed Contract
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default ContractDetails;
