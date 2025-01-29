import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { repairApi } from '../../api';
import { CustomerSelect } from './CustomerSelect';

interface NewRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewRepairModal({ isOpen, onClose }: NewRepairModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customerId: '',
    deviceType: '',
    description: '',
    issue: '',
    estimatedCompletion: '',
    priority: 'normal'
  });

  const mutation = useMutation({
    mutationFn: repairApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      onClose();
      setFormData({
        customerId: '',
        deviceType: '',
        description: '',
        issue: '',
        estimatedCompletion: '',
        priority: 'normal'
      });
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Repair Ticket</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomerSelect
            value={formData.customerId}
            onChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Type
            </label>
            <input
              type="text"
              value={formData.deviceType}
              onChange={(e) => setFormData(prev => ({ ...prev, deviceType: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
              placeholder="e.g., iPhone 13, MacBook Pro 2021"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Description
            </label>
            <textarea
              value={formData.issue}
              onChange={(e) => setFormData(prev => ({ ...prev, issue: e.target.value }))}
              className="w-full px-3 py-2 border rounded-md"
              required
              rows={3}
              placeholder="Describe the issue..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Completion
              </label>
              <input
                type="datetime-local"
                value={formData.estimatedCompletion}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {mutation.isPending ? 'Creating...' : 'Create Repair Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
