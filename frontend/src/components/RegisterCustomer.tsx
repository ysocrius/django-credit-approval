import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { registerCustomer } from '../lib/api';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { getErrorMessage } from '../lib/error-utils';

const registerSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  age: z.number().min(18, 'Age must be at least 18').max(100),
  monthly_income: z.number().min(1000, 'Monthly income must be at least ₹1,000'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterCustomer() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerCustomer,
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <UserPlus className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Register New Customer
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                {...register('first_name')}
                className="input"
                placeholder="John"
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                {...register('last_name')}
                className="input"
                placeholder="Doe"
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Age</label>
              <input
                type="number"
                {...register('age', { valueAsNumber: true })}
                className="input"
                placeholder="30"
                min={18}
                max={100}
              />
              {errors.age && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                {...register('phone_number')}
                className="input"
                placeholder="9876543210"
              />
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone_number.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Monthly Income (₹)</label>
            <input
              type="number"
              {...register('monthly_income', { valueAsNumber: true })}
              className="input"
              placeholder="50000"
              min={1000}
            />
            {errors.monthly_income && (
              <p className="mt-1 text-sm text-red-600">
                {errors.monthly_income.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Approved limit will be calculated as 36 × monthly income (rounded
              to nearest lakh)
            </p>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn btn-primary w-full"
          >
            {mutation.isPending ? 'Registering...' : 'Register Customer'}
          </button>
        </form>

        {mutation.isSuccess && mutation.data && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">
                  Customer Registered Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700 space-y-1">
                  <p>
                    <span className="font-medium">Customer ID:</span>{' '}
                    {mutation.data.customer_id}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span>{' '}
                    {mutation.data.name}
                  </p>
                  <p>
                    <span className="font-medium">Approved Limit:</span>{' '}
                    {formatCurrency(mutation.data.approved_limit)}
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
                  Registration Failed
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
