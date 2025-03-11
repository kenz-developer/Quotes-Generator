import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateQuotePage from './pages/CreateQuotePage';
import ApiDocPage from './pages/ApiDocPage';
import { QuoteProvider } from './context/QuoteContext';

function App() {
  return (
    <QuoteProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateQuotePage />} />
            <Route path="/api-docs" element={<ApiDocPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </QuoteProvider>
  );
}

export default App;