
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Column } from '@/types';

export const VendorColumns: Column[] = [
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
    key: 'type',
    header: 'Type',
    sortable: true,
  },
  {
    key: 'location',
    header: 'Location',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    render: (value: string) => <StatusBadge status={value} />,
    sortable: true,
  },
  {
    key: 'joinDate',
    header: 'Join Date',
    render: (value: string) => formatDate(value),
    sortable: true,
  },
];
