export type EmergencyHotline = {
  id: number;
  name: string;
  phone: string;
  sms: string;
  img: string;
  description: string;
  tags: string[];
};

export const defaultEmergencyHotlines: EmergencyHotline[] = [
  {
    id: 1,
    name: "Gabaldon Police Station",
    phone: "0998-598-5427",
    sms: "0998-598-5427",
    img: "/pnp.png",
    description: "Police assistance — immediate response.",
    tags: ["Police", "24/7"],
  },
  {
    id: 2,
    name: "Gabaldon Fire Station",
    phone: "0942-715-2383",
    sms: "0942-715-2383",
    img: "/bir.png",
    description: "Fire emergencies & rescue.",
    tags: ["Fire", "Rescue"],
  },
  {
    id: 3,
    name: "Gabaldon MDRRMO",
    phone: "0907-073-4444",
    sms: "0907-073-4444",
    img: "/mdrrmo.png",
    description: "Municipal Disaster Risk Reduction & Management Office.",
    tags: ["Disaster", "MDRRMO"],
  },
  {
    id: 4,
    name: "Gabaldon RHU",
    phone: "0977-843-2376",
    sms: "0977-843-2376",
    img: "/health.png",
    description: "Rural Health Unit — medical & health support.",
    tags: ["Health", "RHU"],
  },
];
