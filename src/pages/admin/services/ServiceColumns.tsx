
import { Service } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Column } from "@/types";

export const ServiceColumns: Column[] = [
  {
    accessorKey: "id",
    header: "ID",
    sortable: true,
  },
  {
    accessorKey: "name",
    header: "Service Name",
    sortable: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description: string = row.original.description;
      // Truncate long descriptions
      return description.length > 80 ? `${description.slice(0, 80)}...` : description;
    },
  },
];
