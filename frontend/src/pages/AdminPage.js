import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Phone, MapPin, Calendar, Clock, User, Mail, Gamepad2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from '../components/AdminLogin';

const AdminPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "Admin Dashboard - Karthikeya's Games Galaxy";
    return () => {
      document.title = "Karthikeya's Games Galaxy - Don't be bored get on board!";
    };
  }, []);

  const gameTypeDisplay = {
    'playstation': '🎮 PlayStation',
    'playstation_steering': '🏎️ PlayStation + Steering',
    'xbox': '🎮 Xbox',
    'nintendo_switch': '🕹️ Nintendo Switch',
    'vr': '🥽 VR',
    'board_games': '🎲 Board Games'
  };

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = sessionStorage.getItem('kgg_admin_logged_in') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      fetchBookings();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const handleLogin = (loginStatus) => {
    setIsLoggedIn(loginStatus);
    if (loginStatus) {
      fetchBookings();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kgg_admin_logged_in');
    setIsLoggedIn(false);
    setBookings([]);
  };

  const fetchBookings = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/bookings`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBookings(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Show login page if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gaming-lighter flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-12 h-12 text-gaming-accent mx-auto mb-4 animate-spin" />
          <div className="text-gaming-text text-lg">Loading bookings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-lighter">
      {/* Header */}
      <div className="bg-gaming-light border-b border-gaming-border shadow-gaming">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gaming-text-secondary hover:text-gaming-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gaming-text">🎮 Bookings Admin</h1>
                <p className="text-gaming-text-secondary">Karthikeya Games Galaxy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchBookings}
                className="bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light"
              >
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gaming-card border-gaming-border shadow-gaming">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-gaming-accent mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gaming-text">{bookings.length}</div>
                  <div className="text-gaming-text-secondary">Total Bookings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card border-gaming-border shadow-gaming">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gaming-text">
                    {bookings.filter(b => b.status === 'pending').length}
                  </div>
                  <div className="text-gaming-text-secondary">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card border-gaming-border shadow-gaming">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Gamepad2 className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gaming-text">
                    {bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-gaming-text-secondary">Confirmed</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gaming-card border-gaming-border shadow-gaming">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gaming-text">
                    {new Set(bookings.map(b => b.phone)).size}
                  </div>
                  <div className="text-gaming-text-secondary">Unique Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card className="bg-gaming-card border-gaming-border shadow-gaming">
            <CardContent className="p-12 text-center">
              <Gamepad2 className="w-16 h-16 text-gaming-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gaming-text mb-2">No bookings found</h3>
              <p className="text-gaming-text-secondary">
                Bookings will appear here when customers make reservations.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="bg-gaming-card border-gaming-border shadow-gaming hover:shadow-gaming-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gaming-text flex items-center">
                      <User className="w-5 h-5 mr-2 text-gaming-accent" />
                      {booking.name}
                    </CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      booking.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center text-gaming-text-secondary">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="font-medium">{booking.phone}</span>
                    </div>
                    
                    {booking.email && (
                      <div className="flex items-center text-gaming-text-secondary">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="font-medium">{booking.email}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gaming-text-secondary">
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      <span className="font-medium">{gameTypeDisplay[booking.game_type] || booking.game_type}</span>
                    </div>
                    
                    <div className="flex items-center text-gaming-text-secondary">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="font-medium">{formatDate(booking.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gaming-text-secondary">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="font-medium">{booking.time_slot}</span>
                    </div>
                    
                    <div className="flex items-center text-gaming-text-secondary">
                      <span className="text-xs">ID: {booking.id.substring(0, 8)}...</span>
                    </div>
                  </div>
                  
                  {booking.special_requests && (
                    <div className="mt-4 p-3 bg-gaming-accent-light rounded-lg">
                      <div className="text-sm font-medium text-gaming-text mb-1">Special Requests:</div>
                      <div className="text-gaming-text-secondary">{booking.special_requests}</div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gaming-border">
                    <div className="text-xs text-gaming-text-muted">
                      Booking created: {formatDateTime(booking.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;