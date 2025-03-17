
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';

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
