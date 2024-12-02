import { useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import type { MeetingFilter as MeetingFilterType } from '@/sections/componentStyles/types/meeting';

interface MeetingFilterComponentProps {
  onFilterChange: (filter: MeetingFilterType) => void;
}

export const MeetingFilterComponent = ({ onFilterChange }: MeetingFilterComponentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<MeetingFilterType>({
    status: 'All',
    searchTerm: ''
  });

  const handleFilterChange = (updates: Partial<MeetingFilterType>) => {
    const newFilter = { ...filter, ...updates };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="relative">
  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg glass-effect border border-white/10
                 hover:border-white/20 transition-colors duration-200
                 flex items-center gap-2 text-gray-300"
      >
        <Filter className="w-4 h-4" />
        Filter
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-modalColor rounded-lg shadow-xl border border-white/10 p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={filter.searchTerm}
                  onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
                  placeholder="Search meetings..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                {filter.searchTerm && (
                  <button
                    onClick={() => handleFilterChange({ searchTerm: '' })}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <select
                value={filter.status}
                onChange={(e) => handleFilterChange({ status: e.target.value as MeetingFilterType['status'] })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10
                         text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};