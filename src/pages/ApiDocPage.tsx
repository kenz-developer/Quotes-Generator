import React from 'react';
import { Github, Code, Copy, ExternalLink } from 'lucide-react';

const ApiDocPage: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Kode disalin ke clipboard!');
      })
      .catch((err) => {
        console.error('Gagal menyalin ke clipboard:', err);
      });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Dokumentasi API</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Github className="h-6 w-6 text-gray-800 dark:text-white mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Integrasi dengan GitHub</h2>
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Quotes disimpan dalam repositori GitHub dan dapat diakses melalui GitHub API. Berikut adalah informasi yang diperlukan untuk mengakses data quotes:
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Repository</h3>
          <div className="flex items-center">
            <a 
              href="https://github.com/YoshCasaster/Quotely-Generator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline flex items-center"
            >
              YoshCasaster/Quotely-Generator
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Raw JSON URL</h3>
          <div className="flex items-center bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
            <code className="text-sm text-gray-800 dark:text-gray-200 flex-grow overflow-x-auto">
              https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json
            </code>
            <button 
              onClick={() => copyToClipboard('https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json')}
              className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Copy URL"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <Code className="h-6 w-6 text-gray-800 dark:text-white mr-2" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Contoh Penggunaan API</h2>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Fetch dengan JavaScript</h3>
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code className="text-sm text-gray-800 dark:text-gray-200">
{`// Mengambil semua quotes
fetch('https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Lakukan sesuatu dengan data quotes
  })
  .catch(error => console.error('Error:', error));`}
              </code>
            </pre>
            <button 
              onClick={() => copyToClipboard(`// Mengambil semua quotes
fetch('https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    // Lakukan sesuatu dengan data quotes
  })
  .catch(error => console.error('Error:', error));`)}
              className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Copy code"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Axios dengan React</h3>
          <div className="relative">
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code className="text-sm text-gray-800 dark:text-gray-200">
{`import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuotesComponent() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json'
        );
        setQuotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat quotes');
        setLoading(false);
        console.error(err);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {quotes.map(quote => (
        <div key={quote.id}>
          <p>{quote.text}</p>
          {quote.creator && <p>— {quote.creator}</p>}
        </div>
      ))}
    </div>
  );
}`}
              </code>
            </pre>
            <button 
              onClick={() => copyToClipboard(`import React, { useState, useEffect } from 'react';
import axios from 'axios';

function QuotesComponent() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/YoshCasaster/Quotely-Generator/refs/heads/master/quotdb.json'
        );
        setQuotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat quotes');
        setLoading(false);
        console.error(err);
      }
    };

    fetchQuotes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {quotes.map(quote => (
        <div key={quote.id}>
          <p>{quote.text}</p>
          {quote.creator && <p>— {quote.creator}</p>}
        </div>
      ))}
    </div>
  );
}`)}
              className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Copy code"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Struktur Data</h2>
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Berikut adalah struktur data JSON untuk setiap quote:
        </p>
        
        <div className="relative">
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
            <code className="text-sm text-gray-800 dark:text-gray-200">
{`{
  "id": "string",         // ID unik untuk quote
  "text": "string",       // Teks quote
  "creator": "string",    // Nama pembuat quote (opsional)
  "tag": "string",        // Jenis tag (motivasi, sedih, cinta, dll)
  "theme": "string",      // Tema tampilan card
  "layout": "string",     // Tata letak teks dalam card
  "font": "string",       // Jenis font yang digunakan
  "createdAt": "string"   // Tanggal pembuatan (format ISO)
}`}
            </code>
          </pre>
          <button 
            onClick={() => copyToClipboard(`{
  "id": "string",         // ID unik untuk quote
  "text": "string",       // Teks quote
  "creator": "string",    // Nama pembuat quote (opsional)
  "tag": "string",        // Jenis tag (motivasi, sedih, cinta, dll)
  "theme": "string",      // Tema tampilan card
  "layout": "string",     // Tata letak teks dalam card
  "font": "string",       // Jenis font yang digunakan
  "createdAt": "string"   // Tanggal pembuatan (format ISO)
}`)}
            className="absolute top-2 right-2 p-1 bg-white dark:bg-gray-800 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Copy code"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Catatan Penting</h3>
          <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-2">
            <li>API ini hanya mendukung operasi GET (membaca data).</li>
            <li>Untuk menambahkan quote baru, gunakan fitur "Buat Quote" di website ini.</li>
            <li>Data disimpan dalam format JSON di repositori GitHub.</li>
            <li>Perubahan pada data mungkin tidak langsung terlihat karena caching.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiDocPage;