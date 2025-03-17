
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types';
import { sampleVendors } from '@/data/sampleData';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const EditVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundVendor = sampleVendors.find(v => v.id === id);
    if (foundVendor) {
      setVendor(foundVendor);
    } else {
      toast.error("Vendor not found");
      navigate('/admin/vendors');
    }
  }, [id, navigate]);

  const handleChange = (field: keyof Vendor, value: string) => {
    if (vendor) {
      setVendor({ ...vendor, [field]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would update the vendor in the database
      toast.success(`${vendor?.name} updated successfully`);
      setIsLoading(false);
      navigate('/admin/vendors');
    }, 500);
  };

  if (!vendor) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading vendor data...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/vendors')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Vendor</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Vendor Information</CardTitle>
              <CardDescription>Make changes to the vendor's information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={vendor.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={vendor.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Email Address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={vendor.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Phone Number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Business Type</Label>
                <Input
                  id="type"
                  value={vendor.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  placeholder="Business Type"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={vendor.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="City, State"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={vendor.status}
                  onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/admin/vendors')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </div>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EditVendor;
