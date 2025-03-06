
export type Role = 'admin' | 'agent' | 'vendor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
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
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  type: string;
  location: string;
  joinDate: string;
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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
