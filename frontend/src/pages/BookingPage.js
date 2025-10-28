import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, GamepadIcon, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { bookingService, availabilityService, settingsService } from '../services/api';
import { createBooking } from '../services/api';
import ReferenceNumberModal from '../components/ReferenceNumberModal';
import { useApi, useApiMutation } from '../hooks/useApi';

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    game_type: '',
    time_slot: '',
    special_requests: ''
  });
  
  // Modal state for reference number
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  // Set page title
  useEffect(() => {
    document.title = "Book Your Gaming Session - Karthikeya's Games Galaxy";
    return () => {
      document.title = "Karthikeya's Games Galaxy - Don't be bored , get ON-BOARD";
    };
  }, []);

  // Hardcoded game types list
  const gameTypes = [
    { id: 'playstation', name: 'PlayStation', icon: '🎮' },
    { id: 'playstation_steering', name: 'PlayStation + Steering', icon: '🏎️' },
    { id: 'xbox', name: 'Xbox', icon: '🎮' },
    { id: 'nintendo_switch', name: 'Nintendo Switch', icon: '🕹️' },
    { id: 'vr', name: 'VR', icon: '🥽' },
    { id: 'board_games', name: 'Board Games', icon: '🎲' }
  ];

  // API hooks - only keeping settings for contact info
  const { data: settings, loading: settingsLoading } = useApi(settingsService.get, []);
  const { mutate: createBooking, loading: bookingLoading } = useApiMutation(bookingService.create);

  // Load availability when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate]);

  const loadAvailability = async () => {
    try {
      const availability = await availabilityService.getByDate(selectedDate);
      setAvailableSlots(availability.time_slots);
    } catch (error) {
      console.error('Error loading availability:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.name || !formData.phone || !formData.game_type || !formData.time_slot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const bookingData = {
        ...formData,
        date: selectedDate.toISOString()
      };

      const response = await createBooking(bookingData);
      
      // Store booking response for modal
      setBookingResponse(response);
      
      // Show reference number modal
      setShowReferenceModal(true);
      
      // Show success toast
      toast({
        title: "Booking Confirmed! 🎮",
        description: `Your reference number is ${response.reference_number}`,
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        game_type: '',
        time_slot: '',
        special_requests: ''
      });
      setSelectedDate(null);
      setAvailableSlots([]);

    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getGameTypeDisplay = (gameType) => {
    return `${gameType.icon} ${gameType.name}`;
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gaming-lighter flex items-center justify-center">
        <div className="text-gaming-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-lighter">
      {/* Header */}
      <div className="bg-gaming-light border-b border-gaming-border shadow-gaming">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-gaming-text-secondary hover:text-gaming-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-gaming-text">Book Your Gaming Session</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Booking Form */}
          <div className="xl:col-span-2">
            <Card className="bg-gaming-card border-gaming-border shadow-gaming-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-gaming-text text-xl lg:text-2xl">Booking Details</CardTitle>
                <CardDescription className="text-gaming-text-secondary text-sm lg:text-base">
                  Fill in your details to reserve your gaming session. Pricing will be shared during confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-text">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gaming-text-secondary font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-1 bg-gaming-light border-gaming-border text-gaming-text focus:border-gaming-accent h-10 lg:h-11"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gaming-text-secondary font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 bg-gaming-light border-gaming-border text-gaming-text focus:border-gaming-accent h-10 lg:h-11"
                          placeholder="+91 XXXXX XXXXX"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gaming-text-secondary font-medium">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 bg-gaming-light border-gaming-border text-gaming-text focus:border-gaming-accent h-10 lg:h-11"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Gaming Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-text">Gaming Preferences</h3>
                    <div>
                      <Label className="text-gaming-text-secondary font-medium">Game Type *</Label>
                      <Select onValueChange={(value) => handleInputChange('game_type', value)}>
                        <SelectTrigger className="mt-1 bg-gaming-light border-gaming-border text-gaming-text h-10 lg:h-11">
                          <SelectValue placeholder="Select game type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gaming-border shadow-2xl">
                          {gameTypes.map((game) => (
                            <SelectItem key={game.id} value={game.id} className="focus:bg-gaming-accent-light">
                              {getGameTypeDisplay(game)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gaming-text">Date & Time</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gaming-text-secondary font-medium">Select Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-gaming-light border-gaming-border text-gaming-text hover:bg-gaming-accent-light mt-1 h-10 lg:h-11"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-white border-gaming-border shadow-2xl">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label className="text-gaming-text-secondary font-medium">Time Slot *</Label>
                        <Select onValueChange={(value) => handleInputChange('time_slot', value)}>
                          <SelectTrigger className="mt-1 bg-gaming-light border-gaming-border text-gaming-text h-10 lg:h-11">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gaming-border shadow-2xl">
                            {availableSlots.map((slot) => (
                              <SelectItem 
                                key={slot.time} 
                                value={slot.time}
                                disabled={!slot.available}
                                className="focus:bg-gaming-accent-light"
                              >
                                {slot.time} {!slot.available && '(Booked)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="special_requests" className="text-gaming-text-secondary font-medium">Special Requests (Optional)</Label>
                    <textarea
                      id="special_requests"
                      value={formData.special_requests}
                      onChange={(e) => handleInputChange('special_requests', e.target.value)}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 bg-gaming-light border border-gaming-border rounded-md text-gaming-text resize-none focus:border-gaming-accent focus:outline-none focus:ring-2 focus:ring-gaming-accent/20"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gaming-accent text-gaming-light hover:bg-gaming-accent-hover shadow-gaming-lg h-11 lg:h-12 text-base font-semibold"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Information Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-8">
              <Card className="bg-gaming-card border-gaming-border shadow-gaming-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-gaming-text text-xl">Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-0">
                  {/* Pricing Info */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gaming-text">Pricing</h4>
                    <div className="bg-gaming-accent-light p-4 rounded-lg">
                      <div className="text-center">
                        <div className="text-2xl lg:text-3xl font-bold text-gaming-accent">₹150+</div>
                        <div className="text-gaming-text-secondary text-sm">per hour</div>
                        <div className="text-gaming-text-muted text-xs mt-1">*Varies by game & platform</div>
                      </div>
                    </div>
                    <p className="text-sm text-gaming-text-secondary">
                      Final pricing will be shared during booking confirmation based on your selected game and platform.
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 pt-4 border-t border-gaming-border">
                    <h4 className="font-semibold text-gaming-text">Contact & Location</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gaming-text-secondary">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">+91 77025 28817</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gaming-text-secondary">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">10:00 AM - 11:00 PM (Daily)</span>
                      </div>
                      <div className="flex items-start space-x-3 text-gaming-text-secondary">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">537, BAIRAGIPATTEDA RD, TIRUPATI - 517501</span>
                      </div>
                    </div>
                  </div>

                  {/* Gaming Info */}
                  <div className="space-y-3 pt-4 border-t border-gaming-border">
                    <h4 className="font-semibold text-gaming-text">What's Included</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-gaming-text-secondary">
                        <GamepadIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">All gaming platforms available</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gaming-text-secondary">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Flexible session duration</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gaming-border">
                    <p className="text-sm text-gaming-text-secondary">
                      Need help? Call us at{' '}
                      <a href="tel:+447440070177" className="text-gaming-accent hover:underline font-medium">
                        +44 7440 070177
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Reference Number Modal */}
      <ReferenceNumberModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
        referenceNumber={bookingResponse?.reference_number}
        bookingDetails={bookingResponse && selectedDate ? {
          date: selectedDate,
          time_slot: formData.time_slot,
          game_type: formData.game_type
        } : null}
      />
    </div>
  );
};

export default BookingPage;