import React from 'react';
import styles from './CustomerDetails.module.css';
import { format } from 'date-fns';

interface Device {
  id: string;
  name: string;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  date: string;
  description: string;
}

interface Customer {
  id: string;
  name: string;
  status: string;
  email: string;
  phone: string;
  devices: Device[];
  activities: Activity[];
}

interface CustomerDetailsProps {
  customer: Customer;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customer,
  onEdit,
  onDelete
}) => {
  const getStatusClass = (status: string) => {
    return status.toLowerCase() === 'active' 
      ? styles['statusBadge--active']
      : styles['statusBadge--inactive'];
  };

  const getDeviceStatusClass = (status: string) => {
    return status.toLowerCase() === 'connected'
      ? styles['deviceStatus--connected']
      : styles['deviceStatus--offline'];
  };

  const getTimelineIconClass = (type: string) => {
    return type.toLowerCase() === 'call'
      ? styles['timelineIcon--call']
      : styles['timelineIcon--email'];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.customerName}>{customer.name}</h1>
          <span className={`${styles.statusBadge} ${getStatusClass(customer.status)}`}>
            {customer.status}
          </span>
        </div>
        <div className={styles.actions}>
          {onEdit && (
            <button
              onClick={() => onEdit(customer.id)}
              className={`${styles.actionButton} ${styles['actionButton--edit']}`}
              aria-label="Edit customer"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(customer.id)}
              className={`${styles.actionButton} ${styles['actionButton--delete']}`}
              aria-label="Delete customer"
            >
              Delete
            </button>
          )}
        </div>
      </header>

      <section className={styles.section} aria-label="Contact Information">
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.contactInfo}>
          <div className={styles.contactItem}>
            <span aria-label="Email">📧</span>
            {customer.email}
          </div>
          <div className={styles.contactItem}>
            <span aria-label="Phone">📱</span>
            {customer.phone}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-label="Devices">
        <h2 className={styles.sectionTitle}>Devices</h2>
        <div className={styles.deviceList}>
          {customer.devices.length > 0 ? (
            customer.devices.map((device) => (
              <div key={device.id} className={styles.deviceCard}>
                <div className={styles.deviceInfo}>
                  <span className={styles.deviceName}>{device.name}</span>
                  <span className={`${styles.deviceStatus} ${getDeviceStatusClass(device.status)}`}>
                    {device.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No devices found</div>
          )}
        </div>
      </section>

      <section className={styles.section} aria-label="Activity Timeline">
        <h2 className={styles.sectionTitle}>Activity Timeline</h2>
        <div className={styles.timeline}>
          {customer.activities.length > 0 ? (
            customer.activities.map((activity) => (
              <div key={activity.id} className={styles.timelineItem}>
                <div className={`${styles.timelineIcon} ${getTimelineIconClass(activity.type)}`}>
                  {activity.type === 'Call' ? '📞' : '✉️'}
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineType}>{activity.type}</span>
                    <span className={styles.timelineDate}>
                      {format(new Date(activity.date), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                  <p className={styles.timelineDescription}>{activity.description}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>No activities found</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CustomerDetails;