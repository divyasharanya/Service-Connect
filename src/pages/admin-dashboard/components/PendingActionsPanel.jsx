import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingActionsPanel = () => {
  const pendingActions = [
    {
      id: 1,
      type: 'technician_verification',
      title: 'Technician Verification',
      description: '5 technicians pending background check approval',
      priority: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: 'Shield'
    },
    {
      id: 2,
      type: 'dispute_resolution',
      title: 'Customer Dispute',
      description: 'Payment dispute for booking #BK-2024-1234',
      priority: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      icon: 'AlertTriangle'
    },
    {
      id: 3,
      type: 'support_escalation',
      title: 'Support Escalation',
      description: '3 customer support tickets require admin review',
      priority: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: 'MessageSquare'
    },
    {
      id: 4,
      type: 'refund_request',
      title: 'Refund Request',
      description: 'Customer requesting refund for cancelled service',
      priority: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: 'CreditCard'
    },
    {
      id: 5,
      type: 'service_review',
      title: 'Service Category Review',
      description: 'New service category proposal for approval',
      priority: 'low',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      icon: 'Settings'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pending Actions</h3>
          <span className="text-sm text-muted-foreground">
            {pendingActions?.filter(action => action?.priority === 'high')?.length} high priority
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {pendingActions?.map((action) => (
            <div key={action?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Icon name={action?.icon} size={20} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {action?.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(action?.priority)}`}>
                    {action?.priority}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {action?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(action?.timestamp)}
                  </span>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="xs">
                      View
                    </Button>
                    <Button variant="default" size="xs">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" fullWidth>
            View All Pending Actions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingActionsPanel;