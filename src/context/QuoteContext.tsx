import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

export interface Quote {
  id: string;
  text: string;
  creator?: string;
  tag: string;
  theme: string;
  layout: string;
  font: string;
  createdAt: string;
  imageUrl?: string; // Tambahkan properti imageUrl untuk tema Qimage
}

interface QuoteContextType {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt'>) => Promise<void>;
  filterQuotes: (tag: string) => void;
  filteredQuotes: Quote[];
  activeFilter: string;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuotes = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuotes must be used within a QuoteProvider');
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com/repos/kenz-developer/Quotes-Generator/contents/quotdb.json';
const GITHUB_TOKEN = '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';
const RAW_JSON_URL = 'https://raw.githubusercontent.com/kenz-developer/Quotes-Generator/refs/heads/master/quotdb.json';

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('semua');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(RAW_JSON_URL);
        
        if (response.data && Array.isArray(response.data)) {
          setQuotes(response.data);
          setFilteredQuotes(response.data);
        } else {
          // If the response is not an array, initialize with empty array
          setQuotes([]);
          setFilteredQuotes([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat quotes. Silakan coba lagi nanti.');
        setLoading(false);
        console.error('Error fetching quotes:', err);
      }
    };

    fetchQuotes();
  }, []);

  const addQuote = async (newQuote: Omit<Quote, 'id' | 'createdAt'>) => {
    try {
      const quoteToAdd: Quote = {
        ...newQuote,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      // Add to local state first for immediate UI update
      setQuotes((prevQuotes) => [quoteToAdd, ...prevQuotes]);
      
      if (activeFilter === 'semua' || activeFilter === newQuote.tag) {
        setFilteredQuotes((prevFiltered) => [quoteToAdd, ...prevFiltered]);
      }

      // Now save to GitHub repository
      try {
        // First, get the current file to get the SHA
        const fileResponse = await axios.get(GITHUB_API_URL, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        const sha = fileResponse.data.sha;
        
        // Get the current content
        const currentContent = await axios.get(RAW_JSON_URL);
        let updatedQuotes = [];
        
        if (currentContent.data && Array.isArray(currentContent.data)) {
          // Add the new quote to the beginning of the array
          updatedQuotes = [quoteToAdd, ...currentContent.data];
        } else {
          // If there's no existing data or it's not an array, start with just the new quote
          updatedQuotes = [quoteToAdd];
        }
        
        // Convert the updated quotes array to a JSON string
        const content = JSON.stringify(updatedQuotes, null, 2);
        
        // Encode the content to base64
        const encodedContent = btoa(unescape(encodeURIComponent(content)));
        
        // Update the file in the repository
        await axios.put(GITHUB_API_URL, {
          message: `Add new quote: "${quoteToAdd.text.substring(0, 30)}..."`,
          content: encodedContent,
          sha: sha
        }, {
          headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json'
          }
        });
        
        console.log('Quote successfully saved to GitHub repository');
      } catch (githubError) {
        console.error('Error saving to GitHub:', githubError);
        setError('Quote ditambahkan secara lokal, tetapi gagal menyimpan ke repository. Refresh halaman mungkin akan menghilangkan quote.');
      }
    } catch (err) {
      setError('Gagal menambahkan quote. Silakan coba lagi.');
      console.error('Error adding quote:', err);
    }
  };

  const filterQuotes = (tag: string) => {
    setActiveFilter(tag);
    if (tag === 'semua') {
      setFilteredQuotes(quotes);
    } else {
      setFilteredQuotes(quotes.filter((quote) => quote.tag === tag));
    }
  };

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        loading,
        error,
        addQuote,
        filterQuotes,
        filteredQuotes,
        activeFilter,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
