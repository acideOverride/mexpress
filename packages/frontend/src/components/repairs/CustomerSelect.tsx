import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../../api';

interface CustomerSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerSelect({ value, onChange }: CustomerSelectProps) {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: customerApi.getAll
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Customer
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-md"
        required
        disabled={isLoading}
      >
        <option value="">Select a customer</option>
        {customers?.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name} ({customer.email})
          </option>
        ))}
      </select>
    </div>
  );
}
