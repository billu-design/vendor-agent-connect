
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Column } from '@/types';

export const ContractsColumns: Column[] = [
  {
    accessorKey: 'title',
    header: 'Contract Title',
    sortable: true,
  },
  {
    accessorKey: 'agentName',
    header: 'Agent',
    sortable: true,
  },
  {
    accessorKey: 'vendorName',
    header: 'Vendor',
    sortable: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
    sortable: true,
  },
  {
    accessorKey: 'value',
    header: 'Value',
    render: (value: number) => `$${value.toLocaleString()}`,
    sortable: true,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    render: (value: string) => formatDate(value),
    sortable: true,
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires',
    render: (value: string) => formatDate(value),
    sortable: true,
  },
];
