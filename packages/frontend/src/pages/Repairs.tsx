import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { repairApi } from '../api';
import { NewRepairModal } from '../components/repairs/NewRepairModal';

export function Repairs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: repairs = [] } = useQuery({
    queryKey: ['repairs'],
    queryFn: repairApi.getAll
  });

  const columns = ['backlog', 'in_progress', 'quality_check', 'complete'];
  
  return (
    <div className="h-full">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Repairs Board</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          New Repair
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        {columns.map((column) => (
          <div key={column} className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold mb-4 capitalize">{column.replace('_', ' ')}</h3>
            <div className="space-y-4">
              {repairs
                .filter(repair => repair.status === column)
                .map((repair) => (
                  <div key={repair.id} className="bg-white p-4 rounded-lg shadow">
                    <div className="font-medium">{repair.deviceType}</div>
                    <div className="text-sm text-gray-500 mt-1">{repair.issue}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        repair.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        repair.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        repair.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {repair.priority}
                      </span>
                      {repair.estimatedCompletion && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(repair.estimatedCompletion).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <NewRepairModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
