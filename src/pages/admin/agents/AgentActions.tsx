import { Button } from '@/components/ui/button';
import { Agent } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface AgentActionsProps {
  agent: Agent;
  onDeleteSuccess: (agentId: string) => void; // Callback to update UI after deletion
}

export const AgentActions = ({ agent, onDeleteSuccess }: AgentActionsProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${agent.name}?`)) return;

    try {
      await axios.delete(`/api/agents/${agent.id}`);
      toast.success(`Agent ${agent.name} deleted successfully.`);
      onDeleteSuccess(agent.id); // Update UI
    } catch (error) {
      toast.error('Failed to delete agent. Please try again.');
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="flex space-x-2 justify-end">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate(`/admin/agents/edit/${agent.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
