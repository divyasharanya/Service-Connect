import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onFilterToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
    if (onFilterToggle) {
      onFilterToggle(!isFilterOpen);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e?.target?.value);
    // Trigger search on input change for real-time search
    if (onSearch) {
      onSearch(e?.target?.value);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <form onSubmit={handleSearch} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={16} className="text-muted-foreground" />
          </div>
          <Input
            type="search"
            placeholder="Search for services or technicians..."
            value={searchQuery}
            onChange={handleInputChange}
            className="pl-10"
          />
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={handleFilterToggle}
          iconName="Filter"
          iconSize={16}
          className={isFilterOpen ? 'bg-muted' : ''}
        >
          Filters
        </Button>
        
        <Button
          type="submit"
          variant="default"
          size="default"
          iconName="Search"
          iconSize={16}
        >
          Search
        </Button>
      </form>
      
      {isFilterOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Service Type
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input">
                <option value="">All Services</option>
                <option value="plumber">Plumber</option>
                <option value="carpenter">Carpenter</option>
                <option value="electrician">Electrician</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Availability
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input">
                <option value="">Any Time</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-week">This Week</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">
                Rating
              </label>
              <select className="w-full px-3 py-2 border border-border rounded-md text-sm bg-input">
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="ghost" size="sm">
              Clear Filters
            </Button>
            <Button variant="default" size="sm">
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;