import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, Clock, User, Star, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { touristSpots } from '@/data/touristSpots';
import { useNavigate } from 'react-router-dom';

interface Booking {
  id: string;
  spotId: string;
  spotName: string;
  serviceId: string;
  serviceName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  contactName: string;
  contactPhone: string;
}

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book-1',
      spotId: 'dupinga-river',
      spotName: 'Dupinga River',
      serviceId: 'dupinga-cottage-1',
      serviceName: 'Riverside Bamboo Cottages',
      checkIn: '2025-01-20',
      checkOut: '2025-01-22',
      guests: 2,
      total: 3000,
      status: 'confirmed',
      contactName: 'John Doe',
      contactPhone: '+63 912 345 6789'
    }
  ]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const navigate = useNavigate();

  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-500', icon: AlertCircle, label: 'Pending' },
    confirmed: { color: 'bg-green-100 text-green-500', icon: CheckCircle, label: 'Confirmed' },
    cancelled: { color: 'bg-red-100 text-red-500', icon: XCircle, label: 'Cancelled' }
  };

  return (
    <div className="min-h-screen bg-background pt-5 md:pt-32 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your reservations and services
            </p>
          </div>

          <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white">
                <Plus className="w-5 h-5 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Destination</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {touristSpots.map((spot) => (
                        <SelectItem key={spot.id} value={spot.id}>
                          {spot.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Check-in</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Check-out</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div>
                  <Label>Guests</Label>
                  <Input type="number" min="1" defaultValue="1" />
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <Input placeholder="Your full name" />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input placeholder="+63 912 345 6789" />
                </div>
                <div>
                  <Label>Special Requests</Label>
                  <Textarea placeholder="Any special requirements..." />
                </div>
                <Button className="w-full bg-gradient-primary text-white">
                  Submit Booking Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Bookings List */}
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            const StatusIcon = statusConfig[booking.status].icon;
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">
                          {booking.spotName}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        {booking.serviceName}
                      </p>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {booking.checkIn} to {booking.checkOut}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <span>
                            {booking.guests} guest
                            {booking.guests !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          <span>{booking.contactPhone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Badge
                        className={`${
                          statusConfig[booking.status].color
                        } flex items-center gap-1`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[booking.status].label}
                      </Badge>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ₱{booking.total.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Total Amount
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/app/spot/${booking.spotId}`)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/app/map?focus=${booking.spotId}`)
                      }
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Map
                    </Button>
                    {/* {booking.status === "confirmed" && (
                      <Button
                        size="sm"
                        className="bg-gradient-primary text-white"
                      >
                        Contact Host
                      </Button>
                    )} */}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">
              Start planning your adventure in Gabaldon
            </p>
            <Button
              onClick={() => navigate("/app")}
              className="bg-gradient-primary text-white"
            >
              Explore Destinations
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;