import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemHealthMonitor = () => {
  const [systemMetrics, setSystemMetrics] = useState({
    serverStatus: 'healthy',
    responseTime: 245,
    uptime: 99.8,
    activeConnections: 1247,
    errorRate: 0.02,
    lastUpdated: new Date()
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High Response Time',
      message: 'API response time exceeded 300ms threshold',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      resolved: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Database Maintenance',
      message: 'Scheduled maintenance completed successfully',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      resolved: true
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        responseTime: Math.floor(Math.random() * 100) + 200,
        activeConnections: Math.floor(Math.random() * 200) + 1200,
        errorRate: Math.random() * 0.05,
        lastUpdated: new Date()
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error':
        return { icon: 'XCircle', color: 'text-error' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-warning' };
      case 'info':
        return { icon: 'Info', color: 'text-primary' };
      default:
        return { icon: 'Bell', color: 'text-muted-foreground' };
    }
  };

  const formatUptime = (uptime) => {
    return `${uptime?.toFixed(2)}%`;
  };

  const formatResponseTime = (time) => {
    return `${time}ms`;
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
          <h3 className="text-lg font-semibold text-foreground">System Health</h3>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
            <Button variant="ghost" size="sm" iconName="RefreshCw">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon 
                name={getStatusIcon(systemMetrics?.serverStatus)} 
                size={24} 
                className={getStatusColor(systemMetrics?.serverStatus)}
              />
            </div>
            <p className="text-sm font-medium text-foreground">Server Status</p>
            <p className={`text-xs capitalize ${getStatusColor(systemMetrics?.serverStatus)}`}>
              {systemMetrics?.serverStatus}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Zap" size={24} className="text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Response Time</p>
            <p className={`text-xs ${systemMetrics?.responseTime > 300 ? 'text-warning' : 'text-success'}`}>
              {formatResponseTime(systemMetrics?.responseTime)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Clock" size={24} className="text-accent" />
            </div>
            <p className="text-sm font-medium text-foreground">Uptime</p>
            <p className="text-xs text-success">
              {formatUptime(systemMetrics?.uptime)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Icon name="Users" size={24} className="text-secondary" />
            </div>
            <p className="text-sm font-medium text-foreground">Active Users</p>
            <p className="text-xs text-foreground">
              {systemMetrics?.activeConnections?.toLocaleString()}
            </p>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Performance Metrics</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="text-foreground">45%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Memory Usage</span>
                <span className="text-foreground">62%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Disk Usage</span>
                <span className="text-foreground">78%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="text-foreground">{(systemMetrics?.errorRate * 100)?.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${systemMetrics?.errorRate > 0.03 ? 'bg-error' : 'bg-success'}`} 
                  style={{ width: `${Math.min(systemMetrics?.errorRate * 100 * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Alerts */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Recent Alerts</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {alerts?.map((alert) => {
              const alertInfo = getAlertIcon(alert?.type);
              return (
                <div 
                  key={alert?.id} 
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    alert?.resolved ? 'bg-muted/20 border-border' : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <Icon name={alertInfo?.icon} size={16} className={alertInfo?.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-foreground">{alert?.title}</p>
                      {alert?.resolved && (
                        <span className="text-xs px-2 py-1 bg-success/10 text-success border border-success/20 rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{alert?.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(alert?.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
          <span>Last updated: {systemMetrics?.lastUpdated?.toLocaleTimeString()}</span>
          <Button variant="outline" size="xs">
            View Detailed Logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;