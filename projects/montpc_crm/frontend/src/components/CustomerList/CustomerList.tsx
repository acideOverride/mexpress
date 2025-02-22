import React from 'react';
import { CustomerListProps } from './types';
import styles from './CustomerList.module.css';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onRowClick,
  onAction,
  className = ''
}) => {
  if (!customers.length) {
    return (
      <div className={`${styles['customer-list__container']} ${className}`}>
        <div className={styles['customer-list__empty-state']}>
          No customers found
        </div>
      </div>
    );
  }

  const handleRowClick = (customerId: string) => (event: React.MouseEvent) => {
    // Prevent row click when clicking action button
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    onRowClick?.(customerId);
  };

  const handleAction = (customerId: string, action: string) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onAction?.(customerId, action);
  };

  return (
    <div className={`${styles['customer-list__container']} ${className}`}>
      <table 
        className={styles['customer-list__table']}
        role="table"
        aria-label="Customer List"
      >
        <thead className={styles['customer-list__header']}>
          <tr>
            <th className={styles['customer-list__header-cell']}>Name</th>
            <th className={styles['customer-list__header-cell']}>Status</th>
            <th className={styles['customer-list__header-cell']}>Devices</th>
            <th className={styles['customer-list__header-cell']}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr
              key={customer.id}
              className={styles['customer-list__row']}
              onClick={handleRowClick(customer.id)}
              role="row"
            >
              <td className={styles['customer-list__cell']}>
                <div className={styles['customer-list__name-cell']}>
                  <img
                    src={customer.avatar}
                    alt={`${customer.name} avatar`}
                    className={styles['customer-list__avatar']}
                  />
                  <div className={styles['customer-list__customer-info']}>
                    <span className={styles['customer-list__customer-name']}>
                      {customer.name}
                    </span>
                    <span className={styles['customer-list__customer-email']}>
                      {customer.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className={styles['customer-list__cell']}>
                <span
                  className={`${styles['customer-list__status-badge']} ${
                    styles[`customer-list__status-badge--${customer.status}`]
                  }`}
                >
                  {customer.status}
                </span>
              </td>
              <td className={styles['customer-list__cell']}>
                <div className={styles['customer-list__devices']}>
                  {customer.devices.map((device) => (
                    <span
                      key={device}
                      className={styles['customer-list__device-tag']}
                    >
                      {device}
                    </span>
                  ))}
                </div>
              </td>
              <td className={styles['customer-list__cell']}>
                <div className={styles['customer-list__actions']}>
                  <button
                    className={styles['customer-list__action-button']}
                    onClick={handleAction(customer.id, 'menu')}
                    aria-label="More actions"
                  >
                    <EllipsisVerticalIcon width={20} height={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;