// Simple Vue.js entry point to avoid import issues
document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  
  if (appElement) {
    appElement.innerHTML = `
      <div style="font-family: sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h1>MontPC CRM API</h1>
        <p>✅ The API server is running successfully!</p>
        
        <h2>Available Endpoints:</h2>
        <ul>
          <li><a href="http://localhost:3000/api/health" target="_blank">/api/health</a> - Check API health</li>
          <li><a href="http://localhost:3000/api/customers" target="_blank">/api/customers</a> - Get all customers</li>
        </ul>
        
        <h2>View API Data:</h2>
        <div id="api-data" style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 20px;">
          <p>Loading API data...</p>
        </div>
        
        <button id="refresh-btn" style="margin-top: 20px; padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Data
        </button>
      </div>
    `;
    
    // Function to fetch and display customer data
    const fetchCustomers = async () => {
      const apiDataElement = document.getElementById('api-data');
      
      try {
        const response = await fetch('http://localhost:3000/api/customers');
        const data = await response.json();
        
        if (data.status === 'success') {
          const customers = data.data;
          
          apiDataElement.innerHTML = `
            <h3>Customers (${customers.length}):</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #eee;">
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Name</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Email</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Phone</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${customers.map(customer => `
                  <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px;">${customer.firstName} ${customer.lastName}</td>
                    <td style="padding: 8px;">${customer.email}</td>
                    <td style="padding: 8px;">${customer.phone || 'N/A'}</td>
                    <td style="padding: 8px;">${customer.status}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        } else {
          apiDataElement.innerHTML = `<p>Error: ${data.message || 'Unknown error'}</p>`;
        }
      } catch (error) {
        apiDataElement.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
      }
    };
    
    // Initial data fetch
    fetchCustomers();
    
    // Add refresh button handler
    document.getElementById('refresh-btn').addEventListener('click', fetchCustomers);
  }
});

console.log('Simple Vue entry loaded successfully');