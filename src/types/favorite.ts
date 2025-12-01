import type { Place } from "@/types/place";

export type FavoriteRaw = {
  id: number;
  uuid?: string;
  user_id?: number;
  touristspot_id?: number | string;
  description?: string | null;
  is_deleted?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  tourist_spot?: Place | null;
  [k: string]: any;
};

export type FavoriteListResponse = {
  success: boolean;
  message: string;
  data: FavoriteRaw[];
};

export type FavoriteItemResponse = {
  success: boolean;
  message: string;
  data: FavoriteRaw;
};

export type CreateFavoritePayload = {
  touristspot_id: number | string;
  description?: string;
};

export type FormattedFavorite = {
  id: string;
  placeId: string;
  placeName?: string;
  placeThumb?: string | null;
  description?: string | null;
  createdAt?: string | null;
  raw: FavoriteRaw;
};
