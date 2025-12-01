// src/types/rating.ts
export type UserRaw = {
  id: number;
  uuid?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email_address?: string;
  contact_number?: string;
  profile_url?: string;
  role?: string;
  gender?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type TouristSpotRaw = {
  id: number;
  uuid?: string;
  name?: string;
  description?: string;
  category?: string;
  coordinates?: { lat?: number; lng?: number };
  images?: string[];
  gallery?: string[];
  features?: string[];
  activities?: string[];
  difficulty?: string;
  best_time?: string;
  duration?: string;
  entrance?: string;
  accessibility?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type RatingRaw = {
  id: number;
  uuid?: string;
  description?: string;
  rating: number;
  touristspot_id?: number;
  user_id?: number;
  is_anonymous?: boolean;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  user?: UserRaw;
  tourist_spot?: TouristSpotRaw;
  // optional legacy fields
  ratings?: number;
  comments?: string;
  image_url?: string;
};

export type RatingListResponse = {
  status: boolean;
  message?: string;
  data: RatingRaw[]; // array
};

export type RatingItemResponse = {
  status: boolean;
  message?: string;
  data: RatingRaw;
};

export type CreateRatingPayload = {
  touristspot_id: number;
  rating: number;
  description?: string;
  is_anonymous?: boolean;
};
