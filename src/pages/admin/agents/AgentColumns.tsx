import { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { toast } from 'sonner';

export const AgentColumns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'phone',
    header: 'Phone',
  },
  {
    key: 'region',
    header: 'Region',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
    sortable: true,
  },
  {
    key: 'contractsCount',
    header: 'Contracts',
    sortable: true,
  },
  {
    key: 'joinDate',
    header: 'Join Date',
    render: (value: string) => formatDate(value),
    sortable: true,
  },
];

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get('/api/agents');
        setAgents(response.data);
      } catch (error) {
        setError('Failed to fetch agents');
        toast.error('Error fetching agents. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
};
