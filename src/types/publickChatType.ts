export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  user: User;
  content: string;
  image?: string;
  timestamp: Date;
  replies: Message[];
  likes: number;
  likedBy: string[];
  spotId: string;
}

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  image: string;
  messageCount: number;
}
