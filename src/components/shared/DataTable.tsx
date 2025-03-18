
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { Column } from "@/types";

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: (record: any) => React.ReactNode;
  pageSize?: number;
  searchKey?: string;
  isLoading?: boolean; // Added the isLoading prop to the interface
}

export function DataTable({ columns, data, actions, pageSize = 10, searchKey, isLoading }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter data based on search term
  const filteredData = data.filter((record) =>
    Object.values(record).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue === bValue) return 0;
    
    const comparison = aValue > bValue ? 1 : -1;
    return sortDirection === "asc" ? comparison : -comparison;
  });
  
  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };
  
  const renderSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) return null;
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };
  
  // Get the accessor key for a column (either key or accessorKey)
  const getColumnKey = (column: Column): string => {
    return column.key || column.accessorKey || column.id || "";
  };
  
  // Get the value from a record based on column configuration
  const getCellValue = (record: any, column: Column) => {
    const key = getColumnKey(column);
    return record[key];
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading data...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead 
                    key={getColumnKey(column) || columns.indexOf(column).toString()}
                    onClick={() => column.sortable && handleSort(getColumnKey(column))}
                    className={column.sortable ? "cursor-pointer hover:text-primary" : ""}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && renderSortIcon(getColumnKey(column))}
                    </div>
                  </TableHead>
                ))}
                {actions && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-6 text-muted-foreground">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => (
                  <TableRow key={record.id || index} className="group hover:bg-muted/50">
                    {columns.map((column, colIndex) => (
                      <TableCell key={`${record.id || index}-${getColumnKey(column) || colIndex}`}>
                        {column.cell ? (
                          column.cell({ row: { original: record } })
                        ) : column.render ? (
                          column.render(getCellValue(record, column), record)
                        ) : isStatusColumn(column) ? (
                          <StatusBadge status={getCellValue(record, column)} />
                        ) : (
                          getCellValue(record, column)
                        )}
                      </TableCell>
                    ))}
                    {actions && <TableCell className="text-right">{actions(record)}</TableCell>}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} items
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to determine if a column is a status column
function isStatusColumn(column: Column): boolean {
  return column.key === "status" || column.accessorKey === "status";
}
