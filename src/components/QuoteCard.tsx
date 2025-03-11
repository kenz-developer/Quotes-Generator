import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Quote } from '../context/QuoteContext';

interface QuoteCardProps {
  quote: Quote;
  onClick: () => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onClick }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'd MMMM yyyy', { locale: id });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Tanggal tidak valid';
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'motivasi':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sad':
      case 'sedih':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cinta':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'inspirasi':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'humor':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Render khusus untuk tema Qimage
  if (quote.theme === 'card-theme-qimage' && quote.imageUrl) {
    return (
      <div 
        className={`quote-card rounded-xl overflow-hidden shadow-lg cursor-pointer ${quote.theme}`}
        onClick={onClick}
      >
        <div className="qimage-container h-full">
          <div className="relative">
            <img src={quote.imageUrl} alt="Quote background" className="qimage-img" />
          </div>
          <div className="qimage-content">
            <p className={`text-lg md:text-xl mb-4 ${quote.font}`}>{quote.text}</p>
            {quote.creator && (
              <p className="mt-2 text-sm font-medium">— {quote.creator}</p>
            )}
            <div className="mt-4 flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(quote.tag)}`}>
                {quote.tag}
              </span>
              <span className="text-xs opacity-80">
                {formatDate(quote.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render default untuk tema lainnya
  return (
    <div 
      className={`quote-card rounded-xl overflow-hidden shadow-lg cursor-pointer ${quote.theme} ${quote.layout} ${quote.font}`}
      onClick={onClick}
    >
      <div className="h-full flex flex-col justify-between min-h-[200px]">
        <div className="flex-grow flex items-center justify-center p-6">
          <p className="text-lg md:text-xl">{quote.text}</p>
        </div>
        
        <div className="p-4 bg-white/10 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${getTagColor(quote.tag)}`}>
              {quote.tag}
            </span>
            <span className="text-xs opacity-80">
              {formatDate(quote.createdAt)}
            </span>
          </div>
          {quote.creator && (
            <p className="mt-2 text-sm font-medium">— {quote.creator}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;