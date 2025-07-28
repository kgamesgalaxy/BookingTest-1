import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { AlertCircle, XCircle, ArrowLeft, Calendar, Clock, User, Phone, Mail, Gamepad2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { bookingService } from '../services/api';

const CancelBookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [referenceNumber, setReferenceNumber] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchBooking = async () => {
    if (!referenceNumber.trim()) {
      toast({
        title: "Missing Reference Number",
        description: "Please enter your booking reference number",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const bookingData = await bookingService.getByReference(referenceNumber.trim());
      setBooking(bookingData);
      
      // Check if booking is already cancelled
      if (bookingData.status === 'cancelled') {
        toast({
          title: "Already Cancelled",
          description: "This booking has already been cancelled.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('Error fetching booking:', error);
      
      // Check if it's a 404 error (booking not found)
      if (error.message.includes('404') || error.message.includes('not found')) {
        toast({
          title: "Booking Not Found",
          description: "No booking found with this reference number. Please check and try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch booking details. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    setCancelling(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
      const response = await fetch(`${backendUrl}/api/bookings/reference/${referenceNumber.trim()}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Cancellation Failed",
          description: errorData.detail || "Failed to cancel booking. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      const result = await response.json();
      
      toast({
        title: "Booking Cancelled Successfully! ✅",
        description: "Your booking has been cancelled. You can now book a new session if needed.",
        duration: 5000,
      });
      
      // Update booking status
      setBooking(prev => ({ ...prev, status: 'cancelled' }));
      
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCancelling(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    return format(new Date(dateTimeString), 'PPP p');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canCancel = (booking) => {
    if (!booking || booking.status === 'cancelled') return false;
    
    const sessionTime = new Date(booking.date);
    const currentTime = new Date();
    const timeDifference = sessionTime - currentTime;
    const oneHourInMs = 60 * 60 * 1000;
    
    return timeDifference > oneHourInMs;
  };

  const getTimeUntilSession = (booking) => {
    if (!booking) return '';
    
    const sessionTime = new Date(booking.date);
    const currentTime = new Date();
    const timeDifference = sessionTime - currentTime;
    
    if (timeDifference <= 0) return 'Session has passed';
    
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m until session`;
  };

  return (
    <div className="min-h-screen bg-gaming-lighter pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4 text-gaming-text hover:text-gaming-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gaming-text mb-2">Cancel Booking</h1>
              <p className="text-gaming-text-secondary">
                Enter your reference number to view and cancel your booking
              </p>
            </div>
          </div>

          {/* Reference Number Input */}
          <Card className="mb-6 bg-gaming-card border-gaming-border shadow-gaming">
            <CardHeader>
              <CardTitle className="text-gaming-text flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-500" />
                Enter Reference Number
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reference" className="text-gaming-text">
                    Booking Reference Number
                  </Label>
                  <Input
                    id="reference"
                    type="text"
                    placeholder="Enter your reference number (e.g., KGGABC123)"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
                    className="mt-1 bg-gaming-light border-gaming-border focus:border-gaming-accent"
                  />
                  <p className="text-sm text-gaming-text-secondary mt-1">
                    Reference number starts with "KGG" followed by 6 characters
                  </p>
                </div>
                
                <Button
                  onClick={fetchBooking}
                  disabled={loading || !referenceNumber.trim()}
                  className="w-full bg-gaming-accent hover:bg-gaming-accent-hover text-gaming-light"
                >
                  {loading ? 'Looking up...' : 'Find Booking'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Booking Details */}
          {booking && (
            <Card className="mb-6 bg-gaming-card border-gaming-border shadow-gaming">
              <CardHeader>
                <CardTitle className="text-gaming-text flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Gamepad2 className="w-5 h-5 text-gaming-accent" />
                    Booking Details
                  </span>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gaming-accent" />
                    <div>
                      <p className="text-sm text-gaming-text-secondary">Name</p>
                      <p className="font-medium text-gaming-text">{booking.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gaming-accent" />
                    <div>
                      <p className="text-sm text-gaming-text-secondary">Phone</p>
                      <p className="font-medium text-gaming-text">{booking.phone}</p>
                    </div>
                  </div>
                  
                  {booking.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gaming-accent" />
                      <div>
                        <p className="text-sm text-gaming-text-secondary">Email</p>
                        <p className="font-medium text-gaming-text">{booking.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Gamepad2 className="w-4 h-4 text-gaming-accent" />
                    <div>
                      <p className="text-sm text-gaming-text-secondary">Game Type</p>
                      <p className="font-medium text-gaming-text">{booking.game_type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gaming-accent" />
                    <div>
                      <p className="text-sm text-gaming-text-secondary">Date & Time</p>
                      <p className="font-medium text-gaming-text">
                        {formatDateTime(booking.date)} - {booking.time_slot}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gaming-accent" />
                    <div>
                      <p className="text-sm text-gaming-text-secondary">Time Until Session</p>
                      <p className="font-medium text-gaming-text">{getTimeUntilSession(booking)}</p>
                    </div>
                  </div>
                </div>
                
                {booking.special_requests && (
                  <div className="mt-4 p-3 bg-gaming-light rounded-lg border border-gaming-border">
                    <p className="text-sm text-gaming-text-secondary mb-1">Special Requests</p>
                    <p className="text-gaming-text">{booking.special_requests}</p>
                  </div>
                )}
                
                {/* Cancellation Section */}
                <div className="mt-6 pt-4 border-t border-gaming-border">
                  {booking.status === 'cancelled' ? (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">This booking has been cancelled</span>
                    </div>
                  ) : canCancel(booking) ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-green-600">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">You can cancel this booking</span>
                      </div>
                      <Button
                        onClick={cancelBooking}
                        disabled={cancelling}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Cannot cancel - less than 1 hour before session time
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelBookingPage;