import axios from 'axios';
import type {
  RegisterRequest,
  Customer,
  LoanEligibilityRequest,
  LoanEligibilityResponse,
  CreateLoanRequest,
  CreateLoanResponse,
  Loan,
  LoanDetail,
  HealthResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http:

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>('/health/');
  return response.data;
};
export const registerCustomer = async (
  data: RegisterRequest
): Promise<Customer> => {
  const response = await api.post<Customer>('/register', data);
  return response.data;
};
export const checkLoanEligibility = async (
  data: LoanEligibilityRequest
): Promise<LoanEligibilityResponse> => {
  const response = await api.post<LoanEligibilityResponse>(
    '/check-eligibility',
    data
  );
  return response.data;
};
export const createLoan = async (
  data: CreateLoanRequest
): Promise<CreateLoanResponse> => {
  const response = await api.post<CreateLoanResponse>('/create-loan', data);
  return response.data;
};
export const getLoanDetails = async (loanId: number): Promise<LoanDetail> => {
  const response = await api.get<LoanDetail>(`/view-loan/${loanId}`);
  return response.data;
};
export const getCustomerLoans = async (customerId: number): Promise<Loan[]> => {
  const response = await api.get<Loan[]>(`/view-loans/${customerId}`);
  return response.data;
};

export default api;
