import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Agent } from '@/types';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const EditAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch agent details from API
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const response = await axios.get(`/api/agents/${id}`);
        setAgent(response.data);
      } catch (error) {
        setError('Agent not found.');
        toast.error('Error loading agent data.');
        navigate('/admin/agents');
      }
    };

    fetchAgent();
  }, [id, navigate]);

  const handleChange = (field: keyof Agent, value: string) => {
    if (agent) {
      setAgent({ ...agent, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;

    setIsLoading(true);

    try {
      await axios.put(`/api/agents/${id}`, {
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        region: agent.region,
        status: agent.status,
      });

      toast.success(`${agent.name} updated successfully.`);
      navigate('/admin/agents');
    } catch (error) {
      toast.error('Failed to update agent. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!agent) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>{error || 'Loading agent data...'}</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/agents')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
              <CardDescription>Make changes to the agent's information here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={agent.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Full Name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={agent.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email Address" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={agent.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Phone Number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" value={agent.region} onChange={(e) => handleChange('region', e.target.value)} placeholder="Region/Territory" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={agent.status} onValueChange={(value: 'active' | 'inactive') => handleChange('status', value)}>
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
              <Button variant="outline" onClick={() => navigate('/admin/agents')}>Cancel</Button>
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

export default EditAgent;
