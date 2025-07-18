import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, GamepadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { bookingService, availabilityService, gameTypeService, settingsService } from '../services/api';
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
    duration: 1,
    time_slot: '',
    group_size: 1,
    special_requests: ''
  });

  // API hooks
  const { data: gameTypes, loading: gameTypesLoading } = useApi(gameTypeService.getAll, []);
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

  const calculateTotal = () => {
    if (!settings) return 0;
    
    const duration = parseInt(formData.duration);
    const groupSize = parseInt(formData.group_size);
    const pricing = settings.pricing;
    
    // Group discount: 3+ people get group rate
    const rate = groupSize >= pricing.group_min_size ? pricing.group : pricing.individual;
    return rate * duration * groupSize;
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
        date: selectedDate.toISOString(),
        duration: parseInt(formData.duration),
        group_size: parseInt(formData.group_size)
      };

      await createBooking(bookingData);

      toast({
        title: "Booking Confirmed!",
        description: `Your gaming session has been booked for ${format(selectedDate, 'PPP')} at ${formData.time_slot}`,
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        game_type: '',
        duration: 1,
        time_slot: '',
        group_size: 1,
        special_requests: ''
      });
      setSelectedDate(null);
      setAvailableSlots([]);
    } catch (error) {
      // Error is already handled by useApiMutation
      console.error('Booking error:', error);
    }
  };

  const getGameTypeDisplay = (gameType) => {
    const icons = {
      'ps5': '🎮',
      'xbox': '🎮',
      'switch': '🎮',
      'vr': '🥽',
      'board': '🎲'
    };
    return `${icons[gameType.id] || '🎮'} ${gameType.name}`;
  };

  if (gameTypesLoading || settingsLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-text-secondary hover:text-accent-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold text-text-primary">Book Your Gaming Session</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="bg-bg-secondary border-border-subtle">
              <CardHeader>
                <CardTitle className="text-text-primary">Booking Details</CardTitle>
                <CardDescription className="text-text-secondary">
                  Fill in your details to reserve your gaming session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-text-secondary">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="bg-bg-tertiary border-border-subtle text-text-primary"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-text-secondary">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="bg-bg-tertiary border-border-subtle text-text-primary"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-text-secondary">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-bg-tertiary border-border-subtle text-text-primary"
                      />
                    </div>
                  </div>

                  {/* Gaming Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Gaming Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-text-secondary">Game Type *</Label>
                        <Select onValueChange={(value) => handleInputChange('game_type', value)}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="Select game type" />
                          </SelectTrigger>
                          <SelectContent>
                            {gameTypes?.map((game) => (
                              <SelectItem key={game.id} value={game.id}>
                                {getGameTypeDisplay(game)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-text-secondary">Group Size</Label>
                        <Select onValueChange={(value) => handleInputChange('group_size', parseInt(value))}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="1 person" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'person' : 'people'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-primary">Date & Time</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-text-secondary">Select Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal bg-bg-tertiary border-border-subtle text-text-primary"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
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
                        <Label className="text-text-secondary">Time Slot *</Label>
                        <Select onValueChange={(value) => handleInputChange('time_slot', value)}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableSlots.map((slot) => (
                              <SelectItem 
                                key={slot.time} 
                                value={slot.time}
                                disabled={!slot.available}
                              >
                                {slot.time} {!slot.available && '(Booked)'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-text-secondary">Duration (hours)</Label>
                        <Select onValueChange={(value) => handleInputChange('duration', parseInt(value))}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="1 hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'hour' : 'hours'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="special_requests" className="text-text-secondary">Special Requests (Optional)</Label>
                    <textarea
                      id="special_requests"
                      value={formData.special_requests}
                      onChange={(e) => handleInputChange('special_requests', e.target.value)}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 bg-bg-tertiary border border-border-subtle rounded-md text-text-primary resize-none"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-accent-primary text-bg-primary hover:bg-accent-hover"
                    size="lg"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-bg-secondary border-border-subtle">
              <CardHeader>
                <CardTitle className="text-text-primary">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-text-secondary">
                    <span>Rate per hour:</span>
                    <span>₹{settings && formData.group_size >= settings.pricing.group_min_size ? settings.pricing.group : settings?.pricing.individual || 120}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Duration:</span>
                    <span>{formData.duration} hour(s)</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Group size:</span>
                    <span>{formData.group_size} person(s)</span>
                  </div>
                  {settings && formData.group_size >= settings.pricing.group_min_size && (
                    <div className="flex justify-between text-accent-primary">
                      <span>Group discount:</span>
                      <span>-₹{settings.pricing.individual - settings.pricing.group}/person</span>
                    </div>
                  )}
                  <div className="border-t border-border-subtle pt-2">
                    <div className="flex justify-between font-semibold text-text-primary">
                      <span>Total:</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-border-subtle">
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{settings?.contact.hours || 'Open: 10:00 AM - 10:00 PM'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Group discounts available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <GamepadIcon className="w-4 h-4" />
                    <span className="text-sm">All gaming platforms included</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle">
                  <p className="text-sm text-text-secondary">
                    Need help? Call us at{' '}
                    <a href={`tel:${settings?.contact.phone || '+919876543210'}`} className="text-accent-primary hover:underline">
                      {settings?.contact.phone || '+91 98765 43210'}
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;