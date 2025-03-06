
import { Button } from '@/components/ui/button';
import { Agent } from '@/types';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AgentActionsProps {
  agent: Agent;
  onDelete: (agent: Agent) => void;
}

export const AgentActions = ({ agent, onDelete }: AgentActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex space-x-2 justify-end">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate(`/admin/agents/edit/${agent.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onDelete(agent)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
