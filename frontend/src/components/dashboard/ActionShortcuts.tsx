import React from 'react';

interface ActionShortcutsProps {
  onActionSelect: (action: string) => void;
}

const ActionShortcuts: React.FC<ActionShortcutsProps> = ({ onActionSelect }) => {
  const actions = [
    { 
      id: 'new-call', 
      label: 'New Call', 
      icon: '📞',
      color: 'blue'
    },
    { 
      id: 'new-customer', 
      label: 'New Customer', 
      icon: '👤',
      color: 'green'
    },
    { 
      id: 'sync-data', 
      label: 'Sync Data', 
      icon: '🔄',
      color: 'purple'
    }
  ];

  return (
    <div 
      className="flex space-x-4" 
      data-testid="action-shortcuts"
    >
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onActionSelect(action.id)}
          className={`
            inline-flex flex-col items-center px-6 py-3 
            rounded-lg shadow-sm hover:shadow-md transition-all
            border border-gray-200 bg-white
            hover:border-${action.color}-500 hover:bg-${action.color}-50
            focus:outline-none focus:ring-2 focus:ring-${action.color}-500 focus:ring-offset-2
          `}
        >
          <span 
            className="text-2xl mb-2" 
            role="img" 
            aria-label={action.label}
          >
            {action.icon}
          </span>
          <span className={`text-sm font-medium text-${action.color}-700`}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ActionShortcuts;