import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserManagementSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      type: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      lastActive: '2025-01-05',
      totalBookings: 12,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      type: 'technician',
      status: 'active',
      joinDate: '2024-02-20',
      lastActive: '2025-01-06',
      totalBookings: 45,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      email: 'mike.r@email.com',
      type: 'customer',
      status: 'inactive',
      joinDate: '2024-03-10',
      lastActive: '2024-12-20',
      totalBookings: 3,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      type: 'technician',
      status: 'pending',
      joinDate: '2025-01-02',
      lastActive: '2025-01-06',
      totalBookings: 0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const userTypeOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'customer', label: 'Customers' },
    { value: 'technician', label: 'Technicians' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-border';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getUserTypeIcon = (type) => {
    switch (type) {
      case 'customer':
        return 'User';
      case 'technician':
        return 'Wrench';
      default:
        return 'User';
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         user?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesType = selectedUserType === 'all' || user?.type === selectedUserType;
    return matchesSearch && matchesType;
  });

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev?.includes(userId) 
        ? prev?.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers?.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user?.id));
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">User Management</h3>
          <Button variant="default" iconName="UserPlus" iconPosition="left" size="sm">
            Add User
          </Button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={userTypeOptions}
              value={selectedUserType}
              onChange={setSelectedUserType}
              placeholder="Filter by type"
            />
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Bulk Actions */}
        {selectedUsers?.length > 0 && (
          <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {selectedUsers?.length} user(s) selected
              </span>
              <div className="flex space-x-2">
                <Button variant="outline" size="xs">
                  Activate
                </Button>
                <Button variant="outline" size="xs">
                  Deactivate
                </Button>
                <Button variant="destructive" size="xs">
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.length === filteredUsers?.length && filteredUsers?.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Activity</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user?.id} className="border-b border-border hover:bg-muted/30 transition-micro">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers?.includes(user?.id)}
                      onChange={() => handleUserSelect(user?.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {user?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <Icon name={getUserTypeIcon(user?.type)} size={16} className="text-muted-foreground" />
                      <span className="text-sm text-foreground capitalize">{user?.type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(user?.status)}`}>
                      {user?.status}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="text-sm">
                      <p className="text-foreground">{user?.totalBookings} bookings</p>
                      {user?.rating && (
                        <div className="flex items-center space-x-1">
                          <Icon name="Star" size={12} className="text-warning fill-current" />
                          <span className="text-xs text-muted-foreground">{user?.rating}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="xs" iconName="Eye">
                        View
                      </Button>
                      <Button variant="ghost" size="xs" iconName="Edit">
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementSection;