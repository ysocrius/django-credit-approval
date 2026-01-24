export interface Customer {
  customer_id: number;
  name: string;
  age: number;
  monthly_income: number;
  approved_limit: number;
  phone_number: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  age: number;
  monthly_income: number;
  phone_number: string;
}

export interface LoanEligibilityRequest {
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  tenure: number;
}

export interface LoanEligibilityResponse {
  customer_id: number;
  approval: boolean;
  interest_rate: number;
  corrected_interest_rate: number;
  tenure: number;
  monthly_installment: number;
}

export interface CreateLoanRequest {
  customer_id: number;
  loan_amount: number;
  interest_rate: number;
  tenure: number;
}

export interface CreateLoanResponse {
  loan_id: number | null;
  customer_id: number;
  loan_approved: boolean;
  message: string;
  monthly_installment: number;
}

export interface Loan {
  loan_id: number;
  loan_amount: number;
  interest_rate: number;
  monthly_installment: number;
  tenure: number;
  repayments_left?: number;
  start_date?: string;
  end_date?: string;
}

export interface LoanDetail extends Loan {
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    age: number;
  };
}

export interface HealthResponse {
  status: string;
  message: string;
}
