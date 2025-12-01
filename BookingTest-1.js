import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  ArrowLeft, Calendar as CalendarIcon, Clock, GamepadIcon, Phone, MapPin
} from 'lucide-react';

import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

import {
  bookingService,
  availabilityService,
  settingsService
} from '../services/api';

import ReferenceNumberModal from '../components/ReferenceNumberModal';
import { useApi, useApiMutation } from '../hooks/useApi';
import SplashCursor from '../components/SplashCursor';


const BookingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();


  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [duration, setDuration] = useState(60);
  const [numPeople, setNumPeople] = useState(1);
  const [calculatedPrice, setCalculatedPrice] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    game_type: '',
    time_slot: '',
    special_requests: '',
  });

  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);

  useEffect(() => {
    document.title = "Book Your Gaming Session - Karthikeya's Games Galaxy";
    return () => {
      document.title = "Karthikeya's Games Galaxy - Don't be bored , get ON-BOARD";
    };
  }, []);

  const gameTypes = [
    { id: 'playstation', name: 'PlayStation', icon: '🎮', price: 120 },
    { id: 'playstation_steering', name: 'PS5 + Steering', icon: '🏎️', price: 130 },
    { id: 'xbox', name: 'Xbox', icon: '🎮', price: 120 },
    { id: 'nintendo', name: 'Nintendo Switch', icon: '🕹️', price: 120 },
    { id: 'meta_quest_vr', name: 'Meta Quest VR', icon: '🥽', price: 250 },
    { id: 'board_games', name: 'Board Games', icon: '🎲', price: 50 },
  ];

  const durationOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1 hour 30 minutes' },
    { value: 120, label: '2 hours' },
  ];

  const { data: settings, loading: settingsLoading } = useApi(settingsService.get, []);
  const { mutate: createBooking, loading: bookingLoading } = useApiMutation(bookingService.create);

  useEffect(() => {
    const loadAvailability = async () => {
      if (!selectedDate) {
        setAvailableSlots([]);
        return;
      }

      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        console.log("📅 Fetching availability for:", formattedDate);

        const availability = await availabilityService.getByDate(formattedDate);
        console.log("🔍 Raw availability:", availability);

        
        const slots =
          (Array.isArray(availability?.time_slots) && availability.time_slots) ||
          (Array.isArray(availability?.slots) && availability.slots) ||
          [];

        if (slots.length === 0) {
          console.warn("⚠️ No available slots for selected date.");
        }

        setAvailableSlots(slots);
      } catch (error) {
        console.error("❌ Error loading availability:", error);

        setAvailableSlots([]);

        toast({
          title: "Failed to load time slots",
          description: "There was an issue fetching availability. Try again.",
          variant: "destructive",
        });
      }
    };

    loadAvailability();
  }, [selectedDate, toast]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (formData.game_type && duration && numPeople) {
        try {
          const result = await bookingService.calculatePrice({
            game_type: formData.game_type,
            duration,
            num_people: numPeople,
          });

          setCalculatedPrice(result);
        } catch (error) {
          console.error("Price calculation error:", error);
          setCalculatedPrice(null);
        }
      }
    };

    calculatePrice();
  }, [formData.game_type, duration, numPeople]);

  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !formData.name || !formData.phone || !formData.game_type || !formData.time_slot) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");

      const bookingData = {
        ...formData,
        date: formattedDate,
        duration,
        num_people: numPeople,
        price: calculatedPrice?.total_price || 0,
      };

      const response = await createBooking(bookingData);

      setBookingResponse(response);
      setShowReferenceModal(true);

      toast({
        title: "Booking Confirmed!",
        description: `Reference Number: ${response.reference_number}`,
      });

    
      setFormData({
        name: '',
        phone: '',
        email: '',
        game_type: '',
        time_slot: '',
        special_requests: '',
      });
      setSelectedDate(null);
      setAvailableSlots([]);

    } catch (error) {
      console.error("Booking failed:", error);

      toast({
        title: "Booking Failed",
        description: "Error processing your booking. Try again.",
        variant: "destructive",
      });
    }
  };

  const getGameTypeDisplay = (game) => `${game.icon} ${game.name}`;


  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-gaming-lighter flex items-center justify-center">
        <div className="text-gaming-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-lighter">
      <SplashCursor />

     
      <div className="bg-gaming-light border-b border-gaming-border shadow-gaming">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-gaming-text-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-gaming-text">Book Your Gaming Session</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid grid-cols-1 xl:grid-cols-3 gap-8">

        
        <div className="xl:col-span-2">
          <Card className="bg-gaming-card border-gaming-border shadow-gaming-lg">
            <CardHeader>
              <CardTitle className="text-gaming-text">Booking Details</CardTitle>
              <CardDescription className="text-gaming-text-secondary">
                Fill in your details to reserve your gaming session.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">

                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gaming-text">Personal Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <Label>Phone *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gaming-text">Gaming Preferences</h3>

                
                  <div>
                    <Label>Duration *</Label>
                    <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map(d => (
                          <SelectItem value={d.value.toString()} key={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  
                  <div>
                    <Label>Number of People *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={numPeople}
                      onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>

                  
                  <div>
                    <Label>Game Type *</Label>
                    <Select
                      value={formData.game_type}
                      onValueChange={(v) => handleInputChange('game_type', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select game type" />
                      </SelectTrigger>
                      <SelectContent>
                        {gameTypes.map(g => (
                          <SelectItem key={g.id} value={g.id}>
                            {getGameTypeDisplay(g)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  
                  {calculatedPrice && (
                    <div className="p-4 bg-gaming-accent/10 border border-gaming-accent/30 rounded-lg">
                      <h4 className="font-semibold mb-2">📊 Booking Summary</h4>

                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span>{calculatedPrice.breakdown.rate}</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{duration} minutes</span>
                      </div>

                      <div className="flex justify-between">
                        <span>People:</span>
                        <span>{numPeople}</span>
                      </div>

                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>Total Price:</span>
                        <span className="text-gaming-accent">₹{calculatedPrice.total_price}</span>
                      </div>
                    </div>
                  )}
                </div>

                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gaming-text">Date & Time</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Select Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="mr-2" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="bg-white border p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={d => d < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>Time Slot *</Label>

                      <Select
                        value={formData.time_slot}
                        onValueChange={(v) => handleInputChange('time_slot', v)}
                        disabled={!selectedDate || availableSlots.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedDate
                              ? "Select a date first"
                              : availableSlots.length === 0
                                ? "No slots available"
                                : "Select time"
                          } />
                        </SelectTrigger>

                        <SelectContent className="max-h-[300px]">
                          {availableSlots.length > 0 ? (
                            availableSlots.map((slot, i) => {
                              const timeValue =
                                slot.time ||
                                slot.slot ||
                                `slot-${i}`;

                              return (
                                <SelectItem
                                  key={timeValue}
                                  value={timeValue}
                                  disabled={!slot.available}
                                >
                                  {timeValue} {!slot.available && "(Booked)"}
                                </SelectItem>
                              );
                            })
                          ) : (
                            <div className="px-2 py-6 text-center text-sm">
                              {selectedDate
                                ? "No time slots available"
                                : "Pick a date first"}
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                
                <div>
                  <Label>Special Requests</Label>
                  <textarea
                    className="w-full p-2 rounded border"
                    rows={3}
                    value={formData.special_requests}
                    onChange={(e) => handleInputChange('special_requests', e.target.value)}
                    placeholder="Any special requirements or requests..."
                  />
                </div>

                
                <Button type="submit" 
                className="w-full bg-gaming-accent text-gaming-light hover:bg-gaming-accent-hover shadow-gaming-lg h-11 lg:h-12 text-base font-semibold" 
                disabled={bookingLoading}>
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

       
        <div className="xl:col-span-1">

          <Card className="bg-gaming-card border-gaming-border shadow-gaming-lg sticky top-8">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              
              <div className="bg-gaming-accent-light p-4 rounded text-center">
                <div className="text-3xl font-bold text-gaming-accent">₹150+</div>
                <div className="text-sm">per hour</div>
                <div className="text-xs mt-1">*Varies by platform</div>
              </div>

              
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-semibold">Contact & Location</h4>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4" />
                  <span>+91 7702528817</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4" />
                  <span>10 AM - 11 PM (Daily)</span>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4" />
                  <span>537, BAIRAGIPATTEDA RD, TIRUPATI - 517501</span>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>

     
      <ReferenceNumberModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
        referenceNumber={bookingResponse?.reference_number}
        bookingDetails={
          bookingResponse && selectedDate
            ? {
                date: selectedDate,
                time_slot: formData.time_slot,
                game_type: formData.game_type,
              }
            : null
        }
      />

    </div>
  );
};

export default BookingPage;
