import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { createLoan } from '../lib/api';
import { PlusCircle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

const createLoanSchema = z.object({
  customer_id: z.number().min(1, 'Customer ID is required'),
  loan_amount: z.number().min(1000, 'Loan amount must be at least ₹1,000'),
  interest_rate: z.number().min(0, 'Interest rate cannot be negative').max(100),
  tenure: z.number().min(1, 'Tenure must be at least 1 month').max(360),
});

type CreateLoanFormData = z.infer<typeof createLoanSchema>;

export default function CreateLoan() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLoanFormData>({
    resolver: zodResolver(createLoanSchema),
  });

  const mutation = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: CreateLoanFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <PlusCircle className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">Create New Loan</h2>
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
            {mutation.isPending ? 'Creating Loan...' : 'Create Loan'}
          </button>
        </form>

        {mutation.isSuccess && mutation.data && (
          <div className="mt-6 space-y-4">
            <div
              className={`p-4 rounded-lg border ${
                mutation.data.loan_approved
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                {mutation.data.loan_approved ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3
                    className={`text-sm font-medium ${
                      mutation.data.loan_approved
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {mutation.data.loan_approved
                      ? 'Loan Created Successfully!'
                      : 'Loan Not Approved'}
                  </h3>
                  {mutation.data.message && (
                    <p
                      className={`mt-1 text-sm ${
                        mutation.data.loan_approved
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {mutation.data.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {mutation.data.loan_approved && mutation.data.loan_id && (
              <div className="card bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Loan ID:</span>
                    <p className="font-medium">{mutation.data.loan_id}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Customer ID:</span>
                    <p className="font-medium">
                      {mutation.data.customer_id}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600">Monthly Installment:</span>
                    <p className="font-medium text-lg">
                      {formatCurrency(mutation.data.monthly_installment)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {mutation.isError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">
                  Error Creating Loan
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : 'An error occurred while creating the loan'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
