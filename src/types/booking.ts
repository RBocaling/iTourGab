export type Coordinates = {
  lat: number;
  lng: number;
};

export type PlaceShort = {
  id: string | number;
  uuid?: string;
  name?: string;
  description?: string;
  category?: string;
  coordinates?: Coordinates | null;
  images?: string[];
  gallery?: string[];
  features?: string[];
  activities?: string[];
  difficulty?: string | null;
  bestTime?: string | null;
  duration?: string | null;
  entrance?: string | null;
  accessibility?: string | null;
  isDeleted?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  [k: string]: any;
};

export type ServiceRaw = {
  id?: string | number;
  uuid?: string;
  name?: string;
  type?: string;
  description?: string;
  price?: string | number | null;
  images?: string[];
  image_url?: string;
  contact?: string;
  amenities?: string[];
  tourist_spot?: any;
  isDeleted?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  [k: string]: any;
};

export type AccommodationRaw = {
  id: string | number;
  name?: string;
  price?: number;
  features?: string[];
  capacity?: number;
  image?: string;
  placeId?: number | string;
  [k: string]: any;
};

export type BookingRaw = {
  id?: string | number;
  uuid?: string;
  user_id?: number;
  service_id?: number | string | null;
  accommodation_id?: number | null;
  placeId?: number | string;
  start_date?: string;
  end_date?: string;
  dates?: {
    checkIn?: string;
    checkOut?: string;
  };
  guests?: number;
  rooms?: number;
  special_requests?: string | null;
  total_amount?: string | number | null;
  totalAmount?: number | null;
  is_deleted?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  cancelReason?: string | null;
  rejectReason?: string | null;
  availability?:any;
  service?: ServiceRaw | null;
  services?: ServiceRaw[] | null;
  accommodation?: AccommodationRaw | null;
  place?: PlaceShort | null;
  [k: string]: any;
};

export type BookingListResponse = {
  success: boolean;
  message: string;
  data: BookingRaw[];
};

export type FormattedBooking = {
  id: string;
  spotId: string;
  spotName?: string;
  serviceId?: string | null;
  serviceName?: string | null;
  accommodationId?: string | number | null;
  accommodationName?: string | null;
  checkIn?: string | null;
  checkOut?: string | null;
  guests?: number;
  rooms?: number;
  specialRequests?: string | null;
  total?: number | null;
  place?: PlaceShort | null;
  service?: ServiceRaw | null;
  raw: BookingRaw;
  service_reviews: any;
  status: any;
  cancelReason?: string | null;
  rejectReason?: string | null;
  availability:any;
  tourist_spot:any;
  
};
