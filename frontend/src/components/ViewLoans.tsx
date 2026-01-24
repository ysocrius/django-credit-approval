import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomerLoans, getLoanDetails } from '../lib/api';
import { List, Search, Eye, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ViewLoans() {
  const [customerId, setCustomerId] = useState<number | ''>('');
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);

  const {
    data: loans,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['customerLoans', customerId],
    queryFn: () => getCustomerLoans(Number(customerId)),
    enabled: false,
  });

  const {
    data: loanDetails,
    isLoading: isLoadingDetails,
  } = useQuery({
    queryKey: ['loanDetails', selectedLoanId],
    queryFn: () => getLoanDetails(selectedLoanId!),
    enabled: !!selectedLoanId,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId) {
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <List className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            View Customer Loans
          </h2>
        </div>

        <form onSubmit={handleSearch} className="flex space-x-4">
          <div className="flex-1">
            <label className="label">Customer ID</label>
            <input
              type="number"
              value={customerId}
              onChange={(e) =>
                setCustomerId(e.target.value ? Number(e.target.value) : '')
              }
              className="input"
              placeholder="Enter customer ID"
              min={1}
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn btn-primary">
              <Search className="h-5 w-5 mr-2" />
              Search
            </button>
          </div>
        </form>
      </div>

      {isLoading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
        </div>
      )}

      {error && (
        <div className="card p-4 bg-red-50 border border-red-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error
                  ? error.message
                  : 'Failed to load loans'}
              </p>
            </div>
          </div>
        </div>
      )}

      {loans && loans.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-600">No active loans found for this customer.</p>
        </div>
      )}

      {loans && loans.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">
              Active Loans ({loans.length})
            </h3>
            {loans.map((loan) => (
              <div
                key={loan.loan_id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedLoanId(loan.loan_id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold">
                        Loan #{loan.loan_id}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLoanId(loan.loan_id);
                        }}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Loan Amount:</span>
                        <p className="font-medium">
                          {formatCurrency(loan.loan_amount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Interest Rate:</span>
                        <p className="font-medium">{loan.interest_rate}%</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly EMI:</span>
                        <p className="font-medium">
                          {formatCurrency(loan.monthly_installment)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Repayments Left:</span>
                        <p className="font-medium">
                          {loan.repayments_left || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            {selectedLoanId && (
              <div className="card sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
                {isLoadingDetails ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading...</p>
                  </div>
                ) : loanDetails ? (
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-gray-600">Loan ID:</span>
                      <p className="font-medium">{loanDetails.loan_id}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <p className="font-medium">
                        {loanDetails.customer.first_name}{' '}
                        {loanDetails.customer.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {loanDetails.customer.id} | Age:{' '}
                        {loanDetails.customer.age}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loanDetails.customer.phone_number}
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <span className="text-gray-600">Loan Amount:</span>
                      <p className="font-medium text-lg">
                        {formatCurrency(loanDetails.loan_amount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Interest Rate:</span>
                      <p className="font-medium">{loanDetails.interest_rate}%</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Monthly Installment:</span>
                      <p className="font-medium text-lg">
                        {formatCurrency(loanDetails.monthly_installment)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tenure:</span>
                      <p className="font-medium">{loanDetails.tenure} months</p>
                    </div>
                    {loanDetails.start_date && loanDetails.end_date && (
                      <div className="border-t pt-4 space-y-1">
                        <div>
                          <span className="text-gray-600">Start Date:</span>
                          <p className="font-medium">
                            {formatDate(loanDetails.start_date)}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">End Date:</span>
                          <p className="font-medium">
                            {formatDate(loanDetails.end_date)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
