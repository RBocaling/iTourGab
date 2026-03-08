export type Coordinates = {
  lat: number;
  lng: number;
};

export type Review = {
  comments: string;
  rating: number;
  placeId: string;
  imageUrl?: string;
  parentReviewId?: number | null;
  createAt?: string;
};

export type Service = {
  id: string;
  name: string;
  type: string;
  description?: string;
  price?: string;
  images?: string[];
  contact?: string;
  amenities?: string[];
};

export type Accommodation = {
  id: string;
  name: string;
  price: number;
  features?: string[];
  capacity?: number;
  image?: string;
  placeId?: number | string;
};

export type Place = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  coordinates?: Coordinates;
  images?: string[];
  gallery?: string[];
  features?: string[];
  activities?: string[];
  difficulty?: string;
  bestTime?: string;
  duration?: string;
  entrance?: string;
  accessibility?: string;

  authority_contact_number?: string;
  contact_person_name?: string;
  contact_person_number?: string;
  facebook_page?: string;

  nearby?: string[];
  rating?: number;
  reviews?: Review[];
  services?: Service[];
  accommodation?: Accommodation[];
  [k: string]: any;
};
