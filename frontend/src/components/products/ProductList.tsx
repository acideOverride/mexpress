import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Product, ListResponse } from '../../types';

export const ProductList = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<ListResponse<Product>>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => navigate('/products/new')}
          className="btn btn-primary"
        >
          Add Product
        </button>
      </div>

      <div className="table-container">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell">SKU</th>
              <th className="table-header-cell">Price</th>
              <th className="table-header-cell">Stock</th>
              <th className="table-header-cell">Category</th>
              <th className="table-header-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {data?.items.map((product: Product) => (
              <tr key={product.id} className="table-row">
                <td className="table-cell">{product.name}</td>
                <td className="table-cell">{product.sku}</td>
                <td className="table-cell">
                  ${product.price.toFixed(2)}
                </td>
                <td className="table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock}
                  </span>
                </td>
                <td className="table-cell">
                  {product.category || '-'}
                </td>
                <td className="table-cell">
                  <button
                    onClick={() => navigate(`/products/${product.id}/edit`)}
                    className="btn btn-secondary mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement delete functionality
                      alert('Delete functionality to be implemented');
                    }}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data?.items.length === 0 && (
              <tr>
                <td colSpan={6} className="table-cell text-center text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};