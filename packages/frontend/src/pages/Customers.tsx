import { CustomerList } from '../components/customers/CustomerList';
import { CustomerDetails } from '../components/customers/CustomerDetails';
import { InteractionPanel } from '../components/customers/InteractionPanel';

export function CustomersPage() {
  return (
    <div className="flex h-full">
      {/* Left Panel - Customer List */}
      <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <CustomerList />
      </div>

      {/* Center Panel - Customer Details */}
      <div className="flex-1 border-r border-gray-200 bg-white overflow-y-auto">
        <CustomerDetails />
      </div>

      {/* Right Panel - Interaction Logs */}
      <div className="w-96 bg-white overflow-y-auto">
        <InteractionPanel />
      </div>
    </div>
  );
}
