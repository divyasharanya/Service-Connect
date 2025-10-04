import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onExport,
  isFilterOpen,
  onToggleFilter 
}) => {
  const serviceTypeOptions = [
    { value: '', label: 'All Services' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'hvac', label: 'HVAC' },
    { value: 'painting', label: 'Painting' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'cost-desc', label: 'Highest Cost' },
    { value: 'cost-asc', label: 'Lowest Cost' },
    { value: 'rating-desc', label: 'Highest Rated' }
  ];

  const handleInputChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = filters?.search || filters?.serviceType || filters?.status || 
                          filters?.dateFrom || filters?.dateTo || filters?.minRating;

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleFilter}
            iconName={isFilterOpen ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            className="md:hidden"
          />
        </div>
      </div>
      {/* Filter Content */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block p-4 space-y-4`}>
        {/* Search and Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="search"
            placeholder="Search by technician name or service..."
            value={filters?.search}
            onChange={(e) => handleInputChange('search', e?.target?.value)}
            className="w-full"
          />
          
          <Select
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleInputChange('sortBy', value)}
            placeholder="Sort by..."
          />
        </div>

        {/* Service Type and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            options={serviceTypeOptions}
            value={filters?.serviceType}
            onChange={(value) => handleInputChange('serviceType', value)}
            placeholder="Select service type"
          />
          
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Select status"
          />
        </div>

        {/* Date Range Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom}
            onChange={(e) => handleInputChange('dateFrom', e?.target?.value)}
          />
          
          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo}
            onChange={(e) => handleInputChange('dateTo', e?.target?.value)}
          />
        </div>

        {/* Rating Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Minimum Rating"
            placeholder="e.g., 4.0"
            min="1"
            max="5"
            step="0.1"
            value={filters?.minRating}
            onChange={(e) => handleInputChange('minRating', e?.target?.value)}
          />
          
          <div className="flex items-end">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
                iconSize={16}
                fullWidth
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;