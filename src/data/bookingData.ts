export interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spotName: string;
  type: 'accommodation' | 'tour' | 'activity';
  details: {
    checkIn: string;
    checkOut: string;
    guests: number;
    rooms?: number;
    roomType?: string;
    specialRequests?: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  pricing: {
    basePrice: number;
    taxes: number;
    total: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    spotId: 'dupinga-river',
    spotName: 'Dupinga River',
    type: 'accommodation',
    details: {
      checkIn: '2025-01-15',
      checkOut: '2025-01-17',
      guests: 2,
      rooms: 1,
      roomType: 'Standard Room',
      specialRequests: 'Early check-in if possible'
    },
    contact: {
      name: 'Tourist Explorer',
      email: 'user@example.com',
      phone: '+63 987 654 3210'
    },
    pricing: {
      basePrice: 2500,
      taxes: 300,
      total: 2800
    },
    status: 'confirmed',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:30:00Z'
  }
];

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  description: string;
  spots: string[];
  duration: number; // days
  estimatedBudget: number;
  createdAt: string;
  isPublic: boolean;
}

export const mockItineraries: Itinerary[] = [
  {
    id: 'itinerary-1',
    userId: 'user-1',
    name: 'Gabaldon Nature Adventure',
    description: 'A 3-day exploration of Gabaldon\'s natural wonders',
    spots: ['dupinga-river', 'sierra-madre', 'gabaldon-falls'],
    duration: 3,
    estimatedBudget: 5000,
    createdAt: '2025-01-08T09:00:00Z',
    isPublic: true
  }
];