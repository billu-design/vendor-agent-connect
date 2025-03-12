import { Agent, Contract, User, Vendor } from '@/types';
import axios from 'axios';

// Define your API base URL
const API_BASE_URL = 'https://your-api-url.com/api';

// User related API calls
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
};

// Agent related API calls
export const getAgents = async (): Promise<Agent[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/agents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
};

export const getAgentById = async (agentId: string): Promise<Agent | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/agents/${agentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    return null;
  }
};

// Vendor related API calls
export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
};

export const getVendorById = async (vendorId: string): Promise<Vendor | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching vendor ${vendorId}:`, error);
    return null;
  }
};

// Contract related API calls
export const getContracts = async (): Promise<Contract[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return [];
  }
};

export const getContractById = async (contractId: string): Promise<Contract | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/${contractId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contract ${contractId}:`, error);
    return null;
  }
};

export const getAgentContracts = async (agentId: string): Promise<Contract[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/agents/${agentId}/contracts`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching contracts for agent ${agentId}:`, error);
    return [];
  }
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

// Additional CRUD operations
export const createContract = async (contractData: Omit<Contract, 'id'>): Promise<Contract | null> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contracts`, contractData);
    return response.data;
  } catch (error) {
    console.error('Error creating contract:', error);
    return null;
  }
};

export const updateContract = async (contractId: string, contractData: Partial<Contract>): Promise<Contract | null> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/contracts/${contractId}`, contractData);
    return response.data;
  } catch (error) {
    console.error(`Error updating contract ${contractId}:`, error);
    return null;
  }
};

export const deleteContract = async (contractId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/contracts/${contractId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting contract ${contractId}:`, error);
    return false;
  }
};