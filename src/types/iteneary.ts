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

export type ItineraryPayload = {
  name: string;
  description?: string;
  start_date: string; 
  end_date: string; 
  touristspot_id: number; 
};

export type TouristSpotRaw = {
  id: number;
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
  best_time?: string | null;
  duration?: string | null;
  entrance?: string | null;
  accessibility?: string | null;
  isViewed?: boolean;
  is_deleted?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  [k: string]: any;
};

export type ItineraryRaw = {
  id: number;
  uuid: string;
  name: string;
  description?: string;
  user_id?: number;
  start_date: string; 
  end_date: string; 
  touristspot_id: number;
  is_deleted?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  tourist_spot?: TouristSpotRaw | null;
  [k: string]: any;
};

export type ItineraryListResponse = {
  success: boolean;
  message: string;
  data: ItineraryRaw[];
};

export type FormattedItinerary = {
  id: string; 
  uuid: string;
  userId?: number;
  name: string;
  description?: string;
  startDate: string; 
  endDate: string;
  touristSpotId: string;
  spotName?: string;
  spotCategory?: string;
  place?: PlaceShort | null; 
  raw: ItineraryRaw; 
};
