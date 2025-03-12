import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Column } from "@/types";

export const VendorColumns: Column[] = [
  {
    accessorKey: "name",
    header: "Name",
    sortable: true,
  },
  {
    accessorKey: "email",
    header: "Email",
    sortable: true,
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "type",
    header: "Type",
    sortable: true,
  },
  {
    accessorKey: "location",
    header: "Location",
    sortable: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    render: (value: string) => <StatusBadge status={value} />,
    sortable: true,
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    render: (value: string) => (value ? formatDate(value) : "N/A"),
    sortable: true,
  },
];
