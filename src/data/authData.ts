export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user' | 'business';
  profile: {
    name: string;
    email: string;
    avatar: string;
    phone?: string;
    location?: string;
    bio?: string;
  };
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export const users: User[] = [
  {
    id: 'admin-1',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    profile: {
      name: 'Tourism Admin',
      email: 'admin@itourgab.com',
      avatar: '/mockProfile.jpg',
      phone: '+63 912 345 6789',
      location: 'Gabaldon, Nueva Ecija',
      bio: 'Managing tourism development in Gabaldon'
    },
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  },
  {
    id: 'user-1',
    username: 'user',
    password: 'user',
    role: 'user',
    profile: {
      name: 'Tourist Explorer',
      email: 'user@example.com',
      avatar: '/mockProfile.jpg',
      phone: '+63 987 654 3210',
      location: 'Manila, Philippines',
      bio: 'Love exploring nature and discovering hidden gems'
    },
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  },
  {
    id: 'business-1',
    username: 'business',
    password: 'business',
    role: 'business',
    profile: {
      name: 'Nature Resort Owner',
      email: 'business@example.com',
      avatar: '/mockProfile.jpg',
      phone: '+63 915 555 1234',
      location: 'Gabaldon, Nueva Ecija',
      bio: 'Providing quality accommodation and tour services'
    },
    preferences: {
      notifications: true,
      darkMode: false,
      language: 'en'
    }
  }
];

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  loginAttempts: number;
  lastLoginTime?: Date;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  loginAttempts: 0
};