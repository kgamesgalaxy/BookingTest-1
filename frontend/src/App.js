import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminPage from './pages/AdminPage';
import CancelBookingPage from './pages/CancelBookingPage';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/cancel" element={<CancelBookingPage />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;