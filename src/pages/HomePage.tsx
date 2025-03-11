import React, { useState, useEffect } from 'react';
import { useQuotes } from '../context/QuoteContext';
import QuoteCard from '../components/QuoteCard';
import QuoteModal from '../components/QuoteModal';
import FilterTabs from '../components/FilterTabs';
import { Quote as QuoteIcon, Loader } from 'lucide-react';

const HomePage: React.FC = () => {
  const { filteredQuotes, loading, error } = useQuotes();
  const [selectedQuote, setSelectedQuote] = useState<null | any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    // Initial check
    checkDarkMode();

    // Set up a mutation observer to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  const openModal = (quote: any) => {
    setSelectedQuote(quote);
  };

  const closeModal = () => {
    setSelectedQuote(null);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`hero-section ${isDarkMode ? 'dark-theme' : 'light-theme'} py-20 md:py-32 px-4 text-center text-white`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Temukan Inspirasi dalam Kata-Kata</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Kumpulan quotes inspiratif, motivasi, dan kata-kata bijak untuk mencerahkan hari Anda.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Jelajahi Quotes</h2>
          <FilterTabs />
        </div>
      </section>

      {/* Quotes Gallery */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-10 w-10 text-primary-600 dark:text-primary-400 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                Coba Lagi
              </button>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="text-center py-20">
              <QuoteIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Tidak Ada Quotes</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Tidak ada quotes yang ditemukan untuk filter yang dipilih.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  onClick={() => openModal(quote)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quote Modal */}
      {selectedQuote && (
        <QuoteModal quote={selectedQuote} onClose={closeModal} />
      )}
    </div>
  );
};

export default HomePage;