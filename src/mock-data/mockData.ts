import { Message, TouristSpot, User } from "@/types/publickChatType";

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Maria Santos',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Juan Dela Cruz',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Ana Rodriguez',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: false,
  },
  {
    id: '4',
    name: 'Carlos Mendoza',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
  {
    id: '5',
    name: 'Lisa Garcia',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    isOnline: true,
  },
];

export const touristSpots: TouristSpot[] = [
  {
    id: 'minalungao',
    name: 'Minalungao National Park',
    description: 'Famous limestone formations and crystal clear river',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    messageCount: 0,
  },
  {
    id: 'dupinga',
    name: 'Dupinga River',
    description: 'Perfect for swimming and river trekking',
    image: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    messageCount: 0,
  },
  {
    id: 'casecnan',
    name: 'Casecnan Protected Landscape',
    description: 'Pristine forest and wildlife sanctuary',
    image: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    messageCount: 0,
  },
  {
    id: 'pantabangan',
    name: 'Pantabangan Dam',
    description: 'Scenic dam with boating and fishing activities',
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    messageCount: 0,
  },
  {
    id: 'dalton',
    name: 'Dalton Pass',
    description: 'Historic mountain pass with scenic views',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    messageCount: 0,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    user: mockUsers[0],
    content: 'Just visited Minalungao National Park! The limestone formations are absolutely breathtaking. The water is so clear you can see the bottom! 🏞️',
    image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    spotId: 'minalungao',
    replies: [
      {
        id: '1-1',
        user: mockUsers[1],
        content: 'Amazing! How was the water temperature? Planning to visit next weekend.',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        replies: [],
        likes: 2,
        likedBy: ['2', '3'],
        spotId: 'minalungao',
      },
    ],
    likes: 8,
    likedBy: ['2', '3', '4', '5'],
  },
  {
    id: '2',
    user: mockUsers[1],
    content: 'Dupinga River is perfect for a family day out! The kids loved swimming here. Very safe and clean water. 🏊‍♂️',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    spotId: 'dupinga',
    replies: [],
    likes: 5,
    likedBy: ['1', '3', '4', '5'],
  },
  {
    id: '3',
    user: mockUsers[2],
    content: 'Casecnan Protected Landscape is a hidden gem! Saw so many different bird species during our trek. Nature lovers will absolutely love this place! 🦅',
    image: 'https://images.pexels.com/photos/1578662/pexels-photo-1578662.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    spotId: 'casecnan',
    replies: [
      {
        id: '3-1',
        user: mockUsers[3],
        content: 'Did you need a guide for the trek? How long did it take?',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        replies: [],
        likes: 1,
        likedBy: ['2'],
        spotId: 'casecnan',
      },
    ],
    likes: 6,
    likedBy: ['1', '4', '5'],
  },
  {
    id: '4',
    user: mockUsers[3],
    content: 'Pantabangan Dam offers stunning sunset views! Perfect spot for photography and peaceful boat rides. 🌅',
    image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    spotId: 'pantabangan',
    replies: [],
    likes: 7,
    likedBy: ['1', '2', '5'],
  },
  {
    id: '5',
    user: mockUsers[4],
    content: 'Dalton Pass has such rich history! The mountain views are incredible and the cool breeze is so refreshing. A must-visit for history buffs! 🏔️',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    spotId: 'dalton',
    replies: [
      {
        id: '5-1',
        user: mockUsers[0],
        content: 'I love the historical significance of this place. The memorial is very moving.',
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
        replies: [],
        likes: 3,
        likedBy: ['4', '2', '3'],
        spotId: 'dalton',
      },
    ],
    likes: 4,
    likedBy: ['1', '2', '3'],
  },
];

export const getCurrentUser = (): User => mockUsers[0];