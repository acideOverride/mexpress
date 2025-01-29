import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Repairs"
          value="12"
          trend="+2 this week"
          icon="🔧"
          to="/repairs"
        />
        <DashboardCard
          title="Today's Sales"
          value="€1,234"
          trend="+15% vs yesterday"
          icon="💰"
          to="/sales"
        />
        <DashboardCard
          title="Pending Orders"
          value="8"
          trend="3 urgent"
          icon="📦"
          to="/inventory"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Repairs</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">iPhone 13 Screen Repair</div>
                  <div className="text-sm text-gray-500">Customer: John Doe</div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  In Progress
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Today's Calendar</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 border-b pb-4">
                <div className="text-sm font-medium w-20">
                  {`${10 + i}:00`}
                </div>
                <div>
                  <div className="font-medium">Device Pickup</div>
                  <div className="text-sm text-gray-500">MacBook Pro Repair</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, trend, icon, to }: {
  title: string;
  value: string;
  trend: string;
  icon: string;
  to: string;
}) {
  return (
    <Link to={to} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{trend}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </Link>
  );
}
