import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Customers', path: '/customers', icon: '👥' },
  { name: 'Repairs', path: '/repairs', icon: '🔧' },
  { name: 'Sales', path: '/sales', icon: '💰' },
  { name: 'Calendar', path: '/calendar', icon: '📅' },
  { name: 'Inventory', path: '/inventory', icon: '📦' },
  { name: 'Reports', path: '/reports', icon: '📈' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">mExpress</h2>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm hover:bg-gray-700 ${
              location.pathname === item.path ? 'bg-gray-700' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
