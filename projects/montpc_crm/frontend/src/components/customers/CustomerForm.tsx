import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Customer, Address } from '../../types';

type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;

const emptyAddress: Address = {
  street: '',
  city: '',
  state: '',
  zip: '',
  country: ''
};

export const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phone: '',
    address: emptyAddress
  });

  const [error, setError] = useState<string | null>(null);

  // Fetch customer data if in edit mode
  const { isLoading: isLoadingCustomer } = useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const response = await fetch(`/api/customers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer');
      }
      const data = await response.json();
      setFormData(data);
      return data;
    },
    enabled: isEditMode,
  });

  const mutation = useMutation({
    mutationFn: async (data: CustomerFormData) => {
      const response = await fetch(
        `/api/customers${id ? `/${id}` : ''}`,
        {
          method: id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save customer');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      navigate('/customers');
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'address') {
        setFormData(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (isLoadingCustomer) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit Customer' : 'New Customer'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="card space-y-6">
          <div>
            <label htmlFor="name" className="label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="label">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Address</h3>
            
            <div>
              <label htmlFor="street" className="label">Street</label>
              <input
                type="text"
                id="street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="label">City</label>
                <input
                  type="text"
                  id="city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="state" className="label">State</label>
                <input
                  type="text"
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zip" className="label">ZIP Code</label>
                <input
                  type="text"
                  id="zip"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="country" className="label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  );
};