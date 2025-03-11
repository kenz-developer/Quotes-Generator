import React from 'react';
import { useQuotes } from '../context/QuoteContext';

const FilterTabs: React.FC = () => {
  const { filterQuotes, activeFilter } = useQuotes();

  const filters = [
    { id: 'semua', label: 'Semua' },
    { id: 'motivasi', label: 'Motivasi' },
    { id: 'sedih', label: 'Sedih' },
    { id: 'cinta', label: 'Cinta' },
    { id: 'inspirasi', label: 'Inspirasi' },
    { id: 'humor', label: 'Humor' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => filterQuotes(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-primary-600 text-white dark:bg-primary-700'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;