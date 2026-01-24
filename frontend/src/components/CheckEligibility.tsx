import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { checkLoanEligibility } from '../lib/api';
import { FileCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { getErrorMessage } from '../lib/error-utils';

const eligibilitySchema = z.object({
  customer_id: z.number().min(1, 'Customer ID is required'),
  loan_amount: z.number().min(1000, 'Loan amount must be at least ₹1,000'),
  interest_rate: z.number().min(0, 'Interest rate cannot be negative').max(100),
  tenure: z.number().min(1, 'Tenure must be at least 1 month').max(360),
});

type EligibilityFormData = z.infer<typeof eligibilitySchema>;

export default function CheckEligibility() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EligibilityFormData>({
    resolver: zodResolver(eligibilitySchema),
  });

  const mutation = useMutation({
    mutationFn: checkLoanEligibility,
  });

  const onSubmit = (data: EligibilityFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <FileCheck className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Check Loan Eligibility
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Customer ID</label>
            <input
              type="number"
              {...register('customer_id', { valueAsNumber: true })}
              className="input"
              placeholder="1"
              min={1}
            />
            {errors.customer_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customer_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">Loan Amount (₹)</label>
            <input
              type="number"
              {...register('loan_amount', { valueAsNumber: true })}
              className="input"
              placeholder="500000"
              min={1000}
            />
            {errors.loan_amount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.loan_amount.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                {...register('interest_rate', { valueAsNumber: true })}
                className="input"
                placeholder="10.5"
                min={0}
                max={100}
              />
              {errors.interest_rate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.interest_rate.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Tenure (months)</label>
              <input
                type="number"
                {...register('tenure', { valueAsNumber: true })}
                className="input"
                placeholder="24"
                min={1}
                max={360}
              />
              {errors.tenure && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tenure.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary w-full"
          >
            {mutation.isPending ? 'Checking...' : 'Check Eligibility'}
          </button>
        </form>

        {mutation.isSuccess && mutation.data && (
          <div className="mt-6 space-y-4">
            <div
              className={`p-4 rounded-lg border ${mutation.data.approval
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
                }`}
            >
              <div className="flex items-start space-x-3">
                {mutation.data.approval ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`text-sm font-medium ${mutation.data.approval
                      ? 'text-green-800'
                      : 'text-red-800'
                      }`}
                  >
                    {mutation.data.approval
                      ? 'Loan Approved!'
                      : 'Loan Not Approved'}
                  </h3>
                </div>
              </div>
            </div>

            <div className="card bg-gray-50">
              <h3 className="text-lg font-semibold mb-4">Eligibility Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Customer ID:</span>
                  <p className="font-medium">{mutation.data.customer_id}</p>
                </div>
                <div>
                  <span className="text-gray-600">Requested Interest Rate:</span>
                  <p className="font-medium">
                    {mutation.data.interest_rate}%
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Corrected Interest Rate:</span>
                  <p className="font-medium">
                    {mutation.data.corrected_interest_rate}%
                    {mutation.data.interest_rate !==
                      mutation.data.corrected_interest_rate && (
                        <span className="text-orange-600 ml-2">
                          (Adjusted based on credit score)
                        </span>
                      )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Tenure:</span>
                  <p className="font-medium">{mutation.data.tenure} months</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Monthly Installment:</span>
                  <p className="font-medium text-lg">
                    {formatCurrency(mutation.data.monthly_installment)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Error Checking Eligibility
                </h3>
                <p className="mt-1 text-sm text-red-700 whitespace-pre-line">
                  {getErrorMessage(mutation.error)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
