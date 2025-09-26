import dupingaRiver1 from '@/assets/spots/dupinga-river-1.jpg';
import dupingaRiver2 from '@/assets/spots/dupinga-river-2.jpg';
import dupingaRiver3 from '@/assets/spots/dupinga-river-3.jpg';
import calabasaRiver1 from '@/assets/spots/calabasa-river-1.jpg';
import calabasaRiver2 from '@/assets/spots/calabasa-river-2.jpg';
import sierraMadre1 from '@/assets/spots/sierra-madre-1.jpg';
import sierraMadre2 from '@/assets/spots/sierra-madre-2.jpg';
import gabaldonfalls1 from '@/assets/spots/gabaldon-falls-1.jpg';
import gabaldonfalls2 from '@/assets/spots/gabaldon-falls-2.jpg';
import cabangcalanLake1 from '@/assets/spots/cabangcalan-lake-1.jpg';
import gabaldonecopark1 from '@/assets/spots/gabaldon-ecopark-1.jpg';
import bitulokRiver1 from '@/assets/spots/bitulok-river-1.jpg';
import pantocRiver1 from '@/assets/spots/pantoc-river-1.jpg';
import tagumpayRiver1 from '@/assets/spots/tagumpay-river-1.jpg';
import dupingaReservoir1 from '@/assets/spots/dupinga-reservoir-1.jpg';

export interface Service {
  id: string;
  name: string;
  type: 'accommodation' | 'restaurant' | 'activity' | 'transport';
  description: string;
  price: string;
  images: string[];
  contact: string;
  amenities: string[];
}

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'water' | 'mountain' | 'river' | 'lake' | 'waterfall' | 'ecopark';
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  gallery: string[];
  features: string[];
  activities: string[];
  difficulty: 'easy' | 'moderate' | 'hard';
  bestTime: string;
  duration: string;
  entrance: string;
  accessibility: string;
  nearby: string[];
  rating: number;
  reviews: number;
  services: Service[];
}

export const touristSpots: TouristSpot[] = [
  {
    id: 'dupinga-river',
    name: 'Dupinga River',
    description: 'A popular destination for swimming and picnicking, known for its cool, clear waters and scenic mountain backdrop.',
    category: 'river',
    coordinates: {
      lat: 15.5018428,
      lng: 121.3240814
    },
    images: [dupingaRiver1, dupingaRiver2, dupingaRiver3],
    gallery: [dupingaRiver1, dupingaRiver2, dupingaRiver3],
    features: ['Crystal Clear Water', 'Swimming Areas', 'Picnic Spots', 'Mountain Views'],
    activities: ['Swimming', 'Picnicking', 'Photography', 'Nature Walking'],
    difficulty: 'easy',
    bestTime: 'Dry Season (November to April)',
    duration: '2-4 hours',
    entrance: 'Free',
    accessibility: 'Easy access by vehicle',
    nearby: ['dupinga-reservoir', 'sierra-madre'],
    rating: 4.5,
    reviews: 128,
    services: [
      {
        id: 'dupinga-cottage-1',
        name: 'Riverside Bamboo Cottages',
        type: 'accommodation',
        description: 'Traditional Filipino bamboo cottages with river view',
        price: '₱1,500/night',
        images: [dupingaRiver2],
        contact: '+63 912 345 6789',
        amenities: ['River View', 'Fan', 'Mosquito Net', 'Shared Bathroom']
      },
      {
        id: 'dupinga-food-1',
        name: 'Lola\'s River Grill',
        type: 'restaurant',
        description: 'Fresh grilled fish and local Filipino dishes',
        price: '₱150-300/meal',
        images: [dupingaRiver1],
        contact: '+63 917 123 4567',
        amenities: ['Fresh Fish', 'Local Cuisine', 'River Side Dining', 'Groups Welcome']
      }
    ]
  },
  {
    id: 'calabasa-river',
    name: 'Calabasa River',
    description: 'A serene river ideal for nature walks and relaxation, surrounded by lush greenery.',
    category: 'river',
    coordinates: {
      lat: 15.5289,
      lng: 121.2747
    },
    images: [calabasaRiver1, calabasaRiver2],
    gallery: [calabasaRiver1, calabasaRiver2],
    features: ['Lush Greenery', 'Peaceful Environment', 'Nature Trails', 'Bird Watching'],
    activities: ['Nature Walking', 'Bird Watching', 'Meditation', 'Photography'],
    difficulty: 'easy',
    bestTime: 'Year Round',
    duration: '1-3 hours',
    entrance: 'Free',
    accessibility: 'Walking trail required',
    nearby: ['dupinga-river', 'bitulok-river'],
    rating: 4.2,
    reviews: 85,
    services: [
      {
        id: 'calabasa-eco-1',
        name: 'Nature Guide Service',
        type: 'activity',
        description: 'Expert bird watching and nature trail guide',
        price: '₱500/group',
        images: [calabasaRiver2],
        contact: '+63 920 456 7890',
        amenities: ['Professional Guide', 'Bird List', 'Trail Maps', 'Photography Tips']
      }
    ]
  },
  {
    id: 'sierra-madre',
    name: 'Sierra Madre Mountains',
    description: 'A vast mountain range offering trekking, bird watching, and panoramic views.',
    category: 'mountain',
    coordinates: {
      lat: 15.4509426,
      lng: 121.3383519
    },
    images: [sierraMadre1, sierraMadre2],
    gallery: [sierraMadre1, sierraMadre2],
    features: ['Panoramic Views', 'Diverse Wildlife', 'Trekking Trails', 'Bird Watching'],
    activities: ['Trekking', 'Hiking', 'Bird Watching', 'Mountain Climbing', 'Camping'],
    difficulty: 'hard',
    bestTime: 'Cool months (December to February)',
    duration: 'Full Day to Multi-day',
    entrance: 'Guide fee required',
    accessibility: 'Requires trekking experience',
    nearby: ['dupinga-river', 'gabaldon-falls'],
    rating: 4.8,
    reviews: 203,
    services: [
      {
        id: 'sierra-camping-1',
        name: 'Mountain Base Camp',
        type: 'accommodation',
        description: 'Camping ground with basic facilities at mountain base',
        price: '₱300/person/night',
        images: [sierraMadre2],
        contact: '+63 915 789 0123',
        amenities: ['Tent Rental', 'Campfire Area', 'Basic Restroom', 'Water Source']
      },
      {
        id: 'sierra-guide-1',
        name: 'Mountain Trek Guide',
        type: 'activity',
        description: 'Experienced mountain guides for safe trekking',
        price: '₱800/day',
        images: [sierraMadre1],
        contact: '+63 918 345 6789',
        amenities: ['Safety Equipment', 'Trail Knowledge', 'Emergency Training', 'Wildlife Expertise']
      }
    ]
  },
  {
    id: 'dupinga-reservoir',
    name: 'Dupinga Water Reservoir',
    description: 'A scenic reservoir located beneath the Dupinga Bridge, popular for photography and sightseeing.',
    category: 'water',
    coordinates: {
      lat: 15.505875,
      lng: 121.325111
    },
    images: [dupingaReservoir1],
    gallery: [dupingaReservoir1],
    features: ['Scenic Bridge Views', 'Photography Spots', 'Calm Waters', 'Sunset Views'],
    activities: ['Photography', 'Sightseeing', 'Sunset Viewing', 'Peaceful Walks'],
    difficulty: 'easy',
    bestTime: 'Late afternoon for sunset',
    duration: '1-2 hours',
    entrance: 'Free',
    accessibility: 'Easy vehicle access',
    nearby: ['dupinga-river', 'gabaldon-ecopark'],
    rating: 4.3,
    reviews: 96,
    services: [
      {
        id: 'reservoir-cafe-1',
        name: 'Bridge View Cafe',
        type: 'restaurant',
        description: 'Coffee and snacks with reservoir view',
        price: '₱100-200/person',
        images: [dupingaReservoir1],
        contact: '+63 916 234 5678',
        amenities: ['Bridge View', 'WiFi', 'Local Coffee', 'Pastries']
      }
    ]
  },
  {
    id: 'gabaldon-falls',
    name: 'Gabaldon Falls',
    description: 'A hidden gem featuring a multi-tiered waterfall, accessible through a moderate trek.',
    category: 'waterfall',
    coordinates: {
      lat: 15.4700,
      lng: 121.3000
    },
    images: [gabaldonfalls1, gabaldonfalls2],
    gallery: [gabaldonfalls1, gabaldonfalls2],
    features: ['Multi-tiered Falls', 'Natural Pool', 'Hidden Location', 'Fresh Mountain Water'],
    activities: ['Trekking', 'Swimming', 'Photography', 'Nature Exploration'],
    difficulty: 'moderate',
    bestTime: 'Rainy season for full flow (June to October)',
    duration: '3-5 hours including trek',
    entrance: 'Guide fee recommended',
    accessibility: 'Moderate trek required',
    nearby: ['sierra-madre', 'cabangcalan-lake'],
    rating: 4.7,
    reviews: 154,
    services: [
      {
        id: 'falls-guide-1',
        name: 'Waterfall Trek Guide',
        type: 'activity',
        description: 'Local guide for safe waterfall trekking',
        price: '₱600/group',
        images: [gabaldonfalls1],
        contact: '+63 919 567 8901',
        amenities: ['Safety Briefing', 'Trail Navigation', 'Swimming Safety', 'Photo Assistance']
      }
    ]
  },
  {
    id: 'cabangcalan-lake',
    name: 'Cabangcalan Lake',
    description: 'A tranquil lake surrounded by forest, perfect for kayaking and bird watching.',
    category: 'lake',
    coordinates: {
      lat: 15.4600,
      lng: 121.3100
    },
    images: [cabangcalanLake1],
    gallery: [cabangcalanLake1],
    features: ['Forest Surroundings', 'Kayaking Area', 'Bird Sanctuary', 'Peaceful Waters'],
    activities: ['Kayaking', 'Bird Watching', 'Fishing', 'Nature Photography'],
    difficulty: 'easy',
    bestTime: 'Early morning for bird watching',
    duration: '2-4 hours',
    entrance: 'Small boat rental fee',
    accessibility: 'Boat access available',
    nearby: ['gabaldon-falls', 'gabaldon-ecopark'],
    rating: 4.4,
    reviews: 112,
    services: [
      {
        id: 'lake-kayak-1',
        name: 'Lake Kayak Rental',
        type: 'activity',
        description: 'Kayak rental with safety equipment',
        price: '₱200/hour',
        images: [cabangcalanLake1],
        contact: '+63 922 678 9012',
        amenities: ['Life Jackets', 'Paddles', 'Safety Briefing', 'Guide Available']
      }
    ]
  },
  {
    id: 'gabaldon-ecopark',
    name: 'Gabaldon Ecopark',
    description: 'An educational park offering nature trails, wildlife viewing, and environmental programs.',
    category: 'ecopark',
    coordinates: {
      lat: 15.4750,
      lng: 121.3200
    },
    images: [gabaldonecopark1],
    gallery: [gabaldonecopark1],
    features: ['Educational Trails', 'Wildlife Viewing', 'Environmental Programs', 'Visitor Center'],
    activities: ['Educational Tours', 'Wildlife Viewing', 'Nature Learning', 'Family Activities'],
    difficulty: 'easy',
    bestTime: 'Year Round',
    duration: '2-3 hours',
    entrance: 'Minimal entrance fee',
    accessibility: 'Family-friendly facilities',
    nearby: ['cabangcalan-lake', 'dupinga-reservoir'],
    rating: 4.1,
    reviews: 87,
    services: [
      {
        id: 'ecopark-tours-1',
        name: 'Educational Nature Tours',
        type: 'activity',
        description: 'Guided educational tours about local ecosystem',
        price: '₱150/person',
        images: [gabaldonecopark1],
        contact: '+63 923 789 0123',
        amenities: ['Educational Materials', 'Expert Guide', 'Wildlife Spotting', 'Certificate']
      }
    ]
  },
  {
    id: 'bitulok-river',
    name: 'Bitulok River',
    description: 'A serene river ideal for fishing and picnicking, surrounded by rice fields.',
    category: 'river',
    coordinates: {
      lat: 15.4500,
      lng: 121.3300
    },
    images: [bitulokRiver1],
    gallery: [bitulokRiver1],
    features: ['Fishing Spots', 'Rice Field Views', 'Peaceful Environment', 'Rural Setting'],
    activities: ['Fishing', 'Picnicking', 'Rural Tourism', 'Photography'],
    difficulty: 'easy',
    bestTime: 'Year Round',
    duration: '2-3 hours',
    entrance: 'Free',
    accessibility: 'Easy access through rural roads',
    nearby: ['pantoc-river', 'calabasa-river'],
    rating: 4.0,
    reviews: 64,
    services: [
      {
        id: 'bitulok-fishing-1',
        name: 'Fishing Equipment Rental',
        type: 'activity',
        description: 'Fishing rods and bait for river fishing',
        price: '₱100/day',
        images: [bitulokRiver1],
        contact: '+63 924 890 1234',
        amenities: ['Fishing Rods', 'Bait', 'Instruction', 'Fish Cleaning']
      }
    ]
  },
  {
    id: 'pantoc-river',
    name: 'Pantoc River',
    description: 'A calm river suitable for swimming and family outings.',
    category: 'river',
    coordinates: {
      lat: 15.4600,
      lng: 121.3400
    },
    images: [pantocRiver1],
    gallery: [pantocRiver1],
    features: ['Family-friendly', 'Swimming Areas', 'Calm Waters', 'Shaded Areas'],
    activities: ['Swimming', 'Family Picnics', 'Water Play', 'Relaxation'],
    difficulty: 'easy',
    bestTime: 'Dry Season',
    duration: '2-4 hours',
    entrance: 'Free',
    accessibility: 'Easy family access',
    nearby: ['bitulok-river', 'tagumpay-river'],
    rating: 4.2,
    reviews: 71,
    services: [
      {
        id: 'pantoc-family-1',
        name: 'Family Picnic Area',
        type: 'restaurant',
        description: 'Tables and grilling area for family gatherings',
        price: '₱50/table/day',
        images: [pantocRiver1],
        contact: '+63 925 901 2345',
        amenities: ['Picnic Tables', 'Grilling Area', 'Clean Water', 'Restroom']
      }
    ]
  },
  {
    id: 'tagumpay-river',
    name: 'Tagumpay River',
    description: 'A peaceful river offering scenic views and a quiet retreat.',
    category: 'river',
    coordinates: {
      lat: 15.4800,
      lng: 121.3500
    },
    images: [tagumpayRiver1],
    gallery: [tagumpayRiver1],
    features: ['Scenic Views', 'Quiet Retreat', 'Natural Beauty', 'Peaceful Environment'],
    activities: ['Nature Walks', 'Meditation', 'Photography', 'Peaceful Retreat'],
    difficulty: 'easy',
    bestTime: 'Year Round',
    duration: '1-2 hours',
    entrance: 'Free',
    accessibility: 'Walking access required',
    nearby: ['pantoc-river', 'gabaldon-ecopark'],
    rating: 4.1,
    reviews: 53,
    services: [
      {
        id: 'tagumpay-meditation-1',
        name: 'Meditation Sessions',
        type: 'activity',
        description: 'Guided meditation by the peaceful river',
        price: '₱300/session',
        images: [tagumpayRiver1],
        contact: '+63 926 012 3456',
        amenities: ['Meditation Guide', 'Yoga Mats', 'Peaceful Setting', 'Group Sessions']
      }
    ]
  }
];

export const categories = [
  { id: 'all', name: 'All Spots', icon: '🗺️' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'water', name: 'Water', icon: '💧' },
  { id: 'mountain', name: 'Mountains', icon: '⛰️' },
  { id: 'river', name: 'Rivers', icon: '🏞️' },
  { id: 'waterfall', name: 'Waterfalls', icon: '💦' },
  { id: 'lake', name: 'Lakes', icon: '🏔️' },
  { id: 'ecopark', name: 'Ecoparks', icon: '🌳' }
];