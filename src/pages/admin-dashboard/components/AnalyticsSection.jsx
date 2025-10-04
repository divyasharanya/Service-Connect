import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings } from 'utils/api';
import { setBookings, setBookingsStatus } from 'features/bookings/bookingsSlice';

const AnalyticsSection = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState('7days');

  const revenueData = [
    { name: 'Mon', value: 2400, bookings: 12 },
    { name: 'Tue', value: 1398, bookings: 8 },
    { name: 'Wed', value: 9800, bookings: 24 },
    { name: 'Thu', value: 3908, bookings: 18 },
    { name: 'Fri', value: 4800, bookings: 22 },
    { name: 'Sat', value: 3800, bookings: 16 },
    { name: 'Sun', value: 4300, bookings: 19 }
  ];

  const dispatch = useDispatch();
  const bookings = useSelector((s) => s.bookings.items);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (bookings && bookings.length > 0) return;
      try {
        dispatch(setBookingsStatus('loading'));
        const data = await getBookings();
        if (mounted) dispatch(setBookings(data));
      } finally {
        dispatch(setBookingsStatus('idle'));
      }
    })();
    return () => { mounted = false; };
  }, []);

  const serviceDistribution = useMemo(() => {
    const counts = bookings.reduce((acc, b) => {
      const key = b.serviceName || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const colorMap = {
      Plumber: '#2563EB',
      Plumbing: '#2563EB',
      Electrician: '#059669',
      Electrical: '#059669',
      Carpenter: '#F59E0B',
      Carpentry: '#F59E0B',
      Unknown: '#94A3B8',
    };
    // Convert to array with colors and percentage-like values
    const total = Object.values(counts).reduce((a, v) => a + v, 0) || 1;
    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      raw: count,
      color: colorMap[name] || '#94A3B8',
    }));
  }, [bookings]);

  const userGrowthData = [
    { name: 'Jan', customers: 120, technicians: 15 },
    { name: 'Feb', customers: 180, technicians: 22 },
    { name: 'Mar', customers: 240, technicians: 28 },
    { name: 'Apr', customers: 320, technicians: 35 },
    { name: 'May', customers: 410, technicians: 42 },
    { name: 'Jun', customers: 520, technicians: 48 }
  ];

  const metricOptions = [
    { value: 'revenue', label: 'Revenue Analytics' },
    { value: 'bookings', label: 'Booking Trends' },
    { value: 'users', label: 'User Growth' },
    { value: 'services', label: 'Service Distribution' }
  ];

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const renderChart = () => {
    switch (selectedMetric) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'bookings':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="bookings" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#2563EB" 
                strokeWidth={2}
                name="Customers"
              />
              <Line 
                type="monotone" 
                dataKey="technicians" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Technicians"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'services':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const getMetricSummary = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          total: '$24,408',
          change: '+12.5%',
          changeType: 'positive',
          description: 'Total revenue this week'
        };
      case 'bookings':
        return {
          total: '119',
          change: '+8.2%',
          changeType: 'positive',
          description: 'Total bookings this week'
        };
      case 'users':
        return {
          total: '568',
          change: '+15.3%',
          changeType: 'positive',
          description: 'Total active users'
        };
      case 'services':
        return {
          total: '4',
          change: '0%',
          changeType: 'neutral',
          description: 'Service categories'
        };
      default:
        return null;
    }
  };

  const summary = getMetricSummary();

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground">Analytics Dashboard</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select
              options={metricOptions}
              value={selectedMetric}
              onChange={setSelectedMetric}
              className="w-full sm:w-48"
            />
            <Select
              options={dateRangeOptions}
              value={dateRange}
              onChange={setDateRange}
              className="w-full sm:w-40"
            />
          </div>
        </div>
        
        {/* Metric Summary */}
        {summary && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-foreground">{summary?.total}</p>
                <p className="text-sm text-muted-foreground">{summary?.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={summary?.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  className={summary?.changeType === 'positive' ? 'text-success' : 'text-error'}
                />
                <span className={`text-sm font-medium ${
                  summary?.changeType === 'positive' ? 'text-success' : 'text-error'
                }`}>
                  {summary?.change}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        {/* Chart */}
        <div className="mb-6">
          {renderChart()}
        </div>
        
        {/* Service Distribution Legend (for pie chart) */}
        {selectedMetric === 'services' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {serviceDistribution?.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: service?.color }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{service?.name}</p>
                  <p className="text-xs text-muted-foreground">{service?.raw} bookings ({service?.value}%)</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Export Options */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" iconName="Download" iconPosition="left" size="sm">
            Export PDF
          </Button>
          <Button variant="outline" iconName="FileSpreadsheet" iconPosition="left" size="sm">
            Export CSV
          </Button>
          <Button variant="outline" iconName="Share" iconPosition="left" size="sm">
            Share Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;