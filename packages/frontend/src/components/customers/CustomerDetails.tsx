export function CustomerDetails() {
  return (
    <div className="flex flex-col h-full">
      {/* Customer Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">Tatsiana Yurevich</h2>
          <div className="space-x-2">
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded">DELETE</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">EDIT</button>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="mr-2">📧</span>
            <span>t.yurevich@acronym.com (Personal)</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🔗</span>
            <span>lricker</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">🏷️</span>
            <span>web designer</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span>24 Nov 1993</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">💼</span>
            <span>Works at 34mag.net</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">📍</span>
            <span>Finland</span>
          </div>
        </div>
      </div>

      {/* Related Items Section */}
      <div className="flex-1 p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-600">ALL CUSTOMER'S RELATED</h3>
        
        <div className="space-y-4">
          {/* Example of both states - with and without existing items */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-600">REPAIR 1</span>
              <span className="text-gray-600">STATUS: WAITING PARTS</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-600">create a new repair</span>
              <span className="text-gray-600">quicklink</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-green-600">create a new sale</span>
              <span className="text-gray-600">quicklink</span>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-orange-600">create a new appointment</span>
              <span className="text-gray-600">quicklink</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
