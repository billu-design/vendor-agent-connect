import { useState, useEffect } from "react";
import axios from "axios";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Vendor } from "@/types";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { VendorColumns } from "./VendorColumns";
import { VendorActions } from "./VendorActions";
import { AddVendorDialog } from "./AddVendorDialog";

const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("/api/vendors");
        setVendors(response.data);
      } catch (error) {
        setError("Failed to load vendors.");
        toast.error("Error fetching vendors. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Delete a vendor
  const handleDelete = async (vendor: Vendor) => {
    if (!window.confirm(`Are you sure you want to delete ${vendor.name}?`)) return;

    try {
      await axios.delete(`/api/vendors/${vendor.id}`);
      setVendors((prev) => prev.filter((v) => v.id !== vendor.id));
      toast.success(`${vendor.name} has been removed`);
    } catch (error) {
      toast.error("Failed to delete vendor. Please try again.");
    }
  };

  // Add a new vendor
  const handleAddVendor = async (newVendorData: Omit<Vendor, "id" | "joinDate">) => {
    try {
      const response = await axios.post("/api/vendors", {
        ...newVendorData,
      });

      setVendors((prev) => [...prev, response.data]);
      setIsAddDialogOpen(false);
      toast.success(`${response.data.name} has been added as a vendor`);
    } catch (error) {
      toast.error("Error adding vendor. Please try again.");
    }
  };

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p>{error}</p>;

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

        <AddVendorDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onAddVendor={handleAddVendor} />
      </div>
    </AppLayout>
  );
};

export default Vendors;
