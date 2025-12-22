// src/types/touristSpotType.ts
export type TouristSpotType =
  | "ATTRACTION"
  | "RESORT"
  // | "PARK"
export const TOURIST_SPOT_TYPES: {
  value: TouristSpotType;
  label: string;
  img?:string
}[] = [
  { value: "ATTRACTION", label: "Attraction", img:"/attraction.png" },
  { value: "RESORT", label: "Resort", img:"/resort.png" },
  // { value: "PARK", label: "Park" },
];
