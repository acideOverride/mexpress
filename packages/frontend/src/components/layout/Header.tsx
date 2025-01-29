import { SearchBar } from '../search/SearchBar';

export function Header() {
  return (
    <header className="bg-white shadow h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <SearchBar />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <span>🔔</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
