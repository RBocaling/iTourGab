import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, CreditCard, Check, Star, Wifi, Car, Coffee } from 'lucide-react';
import { touristSpots } from '@/data/touristSpots';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const BookingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const spotId = location.state?.spotId;
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    spot: '',
    roomType: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    specialRequests: ''
  });

  const spot = spotId ? touristSpots.find(s => s.id === spotId) : null;

  const accommodationTypes = [
    {
      id: "standard",
      name: "Standard Room",
      price: 2500,
      features: [
        "Air Conditioning",
        "Private Bathroom",
        "Free WiFi",
        "Mountain View",
      ],
      capacity: 2,
      image: "/deluxe2.jpg",
    },
    {
      id: "deluxe",
      name: "Deluxe Suite",
      price: 4000,
      features: [
        "King Size Bed",
        "Balcony",
        "Mini Bar",
        "River View",
        "Free Breakfast",
      ],
      capacity: 4,
      image: "/deluxe3.jpg",
    },
    {
      id: "family",
      name: "Family Cottage",
      price: 6000,
      features: [
        "2 Bedrooms",
        "Kitchen",
        "Living Area",
        "Garden View",
        "BBQ Area",
      ],
      capacity: 6,
      image: "/FamilyCottage.jpg",
    },
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('contact.')) {
      const contactField = field.split('.')[1];
      setBookingData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const calculateTotal = () => {
    const selectedRoom = accommodationTypes.find(room => room.id === bookingData.roomType);
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) return 0;

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const basePrice = selectedRoom.price * nights * bookingData.rooms;
    const taxes = basePrice * 0.12; // 12% tax
    return basePrice + taxes;
  };

  const handleSubmit = () => {
    toast({
      title: "Booking Submitted!",
      description: "Your booking request has been submitted successfully. You will receive a confirmation email shortly.",
    });
    
    setTimeout(() => {
      navigate('/app/profile');
    }, 2000);
  };

  const steps = [
    { number: 1, title: 'Select Accommodation', icon: MapPin },
    { number: 2, title: 'Trip Details', icon: Calendar },
    { number: 3, title: 'Guest Information', icon: Users },
    { number: 4, title: 'Review & Confirm', icon: Check }
  ];

  return (
    <div className="min-h-screen bg-background pt-3 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-full bg-white/80 backdrop-blur-sm border border-white/30"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Book Your Stay</h1>
            <p className="text-muted-foreground">
              {spot
                ? `Plan your visit to ${spot.name}`
                : "Choose your perfect accommodation"}
            </p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 px-5"
        >
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <div
                  className={`flex items-center gap-2 ${
                    step >= stepItem.number
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step >= stepItem.number
                        ? "bg-gradient-primary  shadow-lg shadow-primary/50 border-none text-white"
                        : "border-none bg-primary/10 text-primary"
                    }`}
                  >
                    {step > stepItem.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <stepItem.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium">
                    {stepItem.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 md:w-16 mx-2 ${
                      step > stepItem.number ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Step Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Step 1: Accommodation Selection */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold mb-4">
                  Choose Your Accommodation
                </h2>
                {accommodationTypes.map((room) => (
                  <Card
                    key={room.id}
                    className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                      bookingData.roomType === room.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleInputChange("roomType", room.id)}
                  >
                    <div className="flex gap-4">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {room.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Up to {room.capacity} guests
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {room.features
                                .slice(0, 3)
                                .map((feature, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-muted px-2 py-1 rounded"
                                  >
                                    {feature}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">
                              ₱{room.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              per night
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Step 2: Trip Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Trip Details</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn">Check-in Date</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={bookingData.checkIn}
                        onChange={(e) =>
                          handleInputChange("checkIn", e.target.value)
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut">Check-out Date</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={bookingData.checkOut}
                        onChange={(e) =>
                          handleInputChange("checkOut", e.target.value)
                        }
                        min={
                          bookingData.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select
                        value={bookingData.guests.toString()}
                        onValueChange={(value) =>
                          handleInputChange("guests", parseInt(value))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Guest{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="rooms">Number of Rooms</Label>
                      <Select
                        value={bookingData.rooms.toString()}
                        onValueChange={(value) =>
                          handleInputChange("rooms", parseInt(value))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Room{num > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Guest Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={bookingData.contact.name}
                        onChange={(e) =>
                          handleInputChange("contact.name", e.target.value)
                        }
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.contact.email}
                        onChange={(e) =>
                          handleInputChange("contact.email", e.target.value)
                        }
                        placeholder="your@email.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={bookingData.contact.phone}
                        onChange={(e) =>
                          handleInputChange("contact.phone", e.target.value)
                        }
                        placeholder="+63 9XX XXX XXXX"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="requests">
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="requests"
                        value={bookingData.specialRequests}
                        onChange={(e) =>
                          handleInputChange("specialRequests", e.target.value)
                        }
                        placeholder="Any special requests or requirements..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                  {spot && (
                    <div className="flex gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                      <img
                        src={spot.images[0]}
                        alt={spot.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {spot.description.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{spot.rating}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Accommodation</p>
                        <p className="font-medium">
                          {
                            accommodationTypes.find(
                              (r) => r.id === bookingData.roomType
                            )?.name
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dates</p>
                        <p className="font-medium">
                          {bookingData.checkIn} to {bookingData.checkOut}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Guests</p>
                        <p className="font-medium">
                          {bookingData.guests} guests
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Rooms</p>
                        <p className="font-medium">
                          {bookingData.rooms} room(s)
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className='space-y-1'>
                        <p className="text-muted-foreground">Contact Person</p>
                        <p className="">
                          Name: {bookingData.contact.name}
                        </p>
                        <p>Email: {bookingData.contact.email}</p>
                        <p>Phone: {bookingData.contact.phone}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-primary text-white">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">
                      Payment Information
                    </h3>
                  </div>
                  <p className="text-white/80 mb-4">
                    This is a booking request. Payment will be processed
                    manually upon confirmation. You will receive payment
                    instructions via email.
                  </p>
                  <div className="bg-white/10 rounded-lg p-4">
                    <p className="text-sm text-white/80">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ₱{calculateTotal().toLocaleString()}
                    </p>
                    <p className="text-sm text-white/80">
                      Includes taxes and fees
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !bookingData.roomType) ||
                    (step === 2 &&
                      (!bookingData.checkIn || !bookingData.checkOut)) ||
                    (step === 3 &&
                      (!bookingData.contact.name ||
                        !bookingData.contact.email ||
                        !bookingData.contact.phone))
                  }
                  className="bg-gradient-primary text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-primary text-white"
                >
                  Confirm Booking
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Summary Card */}
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Booking Summary</h3>

              {bookingData.roomType && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Room Type</span>
                    <span className="font-medium">
                      {
                        accommodationTypes.find(
                          (r) => r.id === bookingData.roomType
                        )?.name
                      }
                    </span>
                  </div>

                  {bookingData.checkIn && bookingData.checkOut && (
                    <>
                      <div className="flex justify-between">
                        <span>Nights</span>
                        <span className="font-medium">
                          {Math.ceil(
                            (new Date(bookingData.checkOut).getTime() -
                              new Date(bookingData.checkIn).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Rooms</span>
                        <span className="font-medium">{bookingData.rooms}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold text-primary">
                        <span>Total</span>
                        <span>₱{calculateTotal().toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {!bookingData.roomType && (
                <p className="text-muted-foreground text-sm">
                  Select an accommodation to see pricing details
                </p>
              )}
            </Card>

            {/* Help Card */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span>📞</span>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-muted-foreground">+63 912 345 6789</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span>✉️</span>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">help@itourgab.com</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;