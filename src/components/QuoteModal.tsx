import React, { useEffect, useRef } from 'react';
import { X, Share2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Quote } from '../context/QuoteContext';

interface QuoteModalProps {
  quote: Quote;
  onClose: () => void;
}

const QuoteModal: React.FC<QuoteModalProps> = ({ quote, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

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

  const handleShare = async () => {
    const shareText = `"${quote.text}" ${quote.creator ? `- ${quote.creator}` : ''} #${quote.tag}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bagikan Quote',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(shareText);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Quote disalin ke clipboard!');
      })
      .catch((err) => {
        console.error('Gagal menyalin ke clipboard:', err);
      });
  };

  // Render khusus untuk tema Qimage
  if (quote.theme === 'card-theme-qimage' && quote.imageUrl) {
    return (
      <div className="modal-backdrop animate-fade-in">
        <div 
          ref={modalRef}
          className="modal-content max-w-3xl w-full mx-4 animate-fade-in"
        >
          <div className={`${quote.theme} min-h-[400px] relative`}>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="qimage-container h-full">
              <div className="relative">
                <img src={quote.imageUrl} alt="Quote background" className="qimage-img" />
              </div>
              <div className="qimage-content">
                <p className={`text-xl md:text-2xl mb-6 ${quote.font}`}>{quote.text}</p>
                {quote.creator && (
                  <p className="text-lg font-medium mt-4">— {quote.creator}</p>
                )}
                <div className="mt-6 flex justify-between items-center">
                  <span className={`text-sm px-3 py-1 rounded-full ${getTagColor(quote.tag)}`}>
                    {quote.tag}
                  </span>
                  <span className="text-sm opacity-80">
                    {formatDate(quote.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 flex justify-end space-x-2">
            <button 
              onClick={handleShare}
              className="flex items-center space-x-1 px-4 py-2 rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Bagikan</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render default untuk tema lainnya
  return (
    <div className="modal-backdrop animate-fade-in">
      <div 
        ref={modalRef}
        className="modal-content max-w-2xl w-full mx-4 animate-fade-in"
      >
        <div className={`${quote.theme} ${quote.layout} ${quote.font} min-h-[300px] p-8 relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex flex-col h-full justify-center">
            <p className="text-2xl md:text-3xl mb-6">{quote.text}</p>
            
            {quote.creator && (
              <p className="text-lg font-medium mt-2">— {quote.creator}</p>
            )}
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <span className={`text-sm px-3 py-1 rounded-full ${getTagColor(quote.tag)}`}>
              {quote.tag}
            </span>
            <span className="text-sm opacity-80">
              {formatDate(quote.createdAt)}
            </span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 flex justify-end space-x-2">
          <button 
            onClick={handleShare}
            className="flex items-center space-x-1 px-4 py-2 rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;