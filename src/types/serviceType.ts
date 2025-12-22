export const SERVICE_TYPES = [
  { value: "FOOD", label: "Food" },
  { value: "ROOM", label: "Room" },
  { value: "OTHER", label: "Other" },
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number]["value"];
