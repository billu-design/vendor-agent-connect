
export type Role = 'admin' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  password?: string;
  verified?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  contractsCount: number;
  region: string;
  joinDate: string;
  address?: string;
}

export interface Vendor {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  type: string;
  location: string;
  joinDate: string;
  password?: string;
  verified?: boolean;
  serviceTypes?: string[];
}

export interface Contract {
  id: string;
  title: string;
  agentId: string;
  agentName: string;
  vendorId: string;
  vendorName: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  createdAt: string;
  expiresAt: string;
  value: number;
  document: string;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeVendorRegistration?: (email: string, password: string) => Promise<void>;
}

export interface Column {
  key?: string;
  accessorKey?: string;
  header?: string;
  render?: (value: any, record: any) => React.ReactNode;
  sortable?: boolean;
  cell?: ({ row }: { row: { original: any } }) => React.ReactNode;
  id?: string;
}

export interface ContractCardProps {
  contract: Contract;
  onSendEmail?: (contract: Contract) => void;
  onStatusUpdate?: (contract: Contract) => void;
  isLoading?: boolean;
  actions?: React.ReactNode;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code?: string;
}
