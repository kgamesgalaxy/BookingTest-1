import React, { useState } from 'react';
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
import { mockBookings } from '../data/mockData';

const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gameType: '',
    duration: '1',
    timeSlot: '',
    groupSize: '1',
    specialRequests: ''
  });

  const gameTypes = [
    { value: 'playstation', label: 'PlayStation', icon: '🎮' },
    { value: 'xbox', label: 'Xbox', icon: '🎮' },
    { value: 'nintendo', label: 'Nintendo Switch', icon: '🎮' },
    { value: 'vr', label: 'VR Gaming', icon: '🥽' },
    { value: 'board', label: 'Board Games', icon: '🎲' }
  ];

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
  ];

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotal = () => {
    const baseRate = 120;
    const duration = parseInt(formData.duration);
    const groupSize = parseInt(formData.groupSize);
    
    // Group discount: 3+ people get ₹20 off per person
    const discountedRate = groupSize >= 3 ? 100 : baseRate;
    return discountedRate * duration * groupSize;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.name || !formData.phone || !formData.gameType || !formData.timeSlot) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Mock booking creation
    const newBooking = {
      id: Date.now(),
      ...formData,
      date: selectedDate,
      total: calculateTotal(),
      status: 'confirmed',
      createdAt: new Date()
    };

    mockBookings.push(newBooking);

    toast({
      title: "Booking Confirmed!",
      description: `Your gaming session has been booked for ${format(selectedDate, 'PPP')} at ${formData.timeSlot}`,
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      gameType: '',
      duration: '1',
      timeSlot: '',
      groupSize: '1',
      specialRequests: ''
    });
    setSelectedDate(null);
  };

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
                        <Select onValueChange={(value) => handleInputChange('gameType', value)}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="Select game type" />
                          </SelectTrigger>
                          <SelectContent>
                            {gameTypes.map((game) => (
                              <SelectItem key={game.value} value={game.value}>
                                {game.icon} {game.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-text-secondary">Group Size</Label>
                        <Select onValueChange={(value) => handleInputChange('groupSize', value)}>
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
                        <Select onValueChange={(value) => handleInputChange('timeSlot', value)}>
                          <SelectTrigger className="bg-bg-tertiary border-border-subtle text-text-primary">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-text-secondary">Duration (hours)</Label>
                        <Select onValueChange={(value) => handleInputChange('duration', value)}>
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
                    <Label htmlFor="specialRequests" className="text-text-secondary">Special Requests (Optional)</Label>
                    <textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
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
                  >
                    Confirm Booking
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
                    <span>₹{parseInt(formData.groupSize) >= 3 ? '100' : '120'}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Duration:</span>
                    <span>{formData.duration} hour(s)</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Group size:</span>
                    <span>{formData.groupSize} person(s)</span>
                  </div>
                  {parseInt(formData.groupSize) >= 3 && (
                    <div className="flex justify-between text-accent-primary">
                      <span>Group discount:</span>
                      <span>-₹20/person</span>
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
                    <span className="text-sm">Open: 10:00 AM - 10:00 PM</span>
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
                    <a href="tel:+919876543210" className="text-accent-primary hover:underline">
                      +91 98765 43210
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