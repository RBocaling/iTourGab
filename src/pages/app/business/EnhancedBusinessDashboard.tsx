import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, 
  DollarSign, 
  Users, 
  Star, 
  Calendar, 
  Plus,
  Edit,
  Eye,
  TrendingUp,
  MessageCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

const EnhancedBusinessDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Listings',
      value: '8',
      change: '+2 this month',
      icon: Store,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Revenue',
      value: '₱45,230',
      change: '+15% this week',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Bookings',
      value: '127',
      change: '+23 pending',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Rating',
      value: '4.8',
      change: '89 reviews',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const listings = [
    {
      id: '1',
      name: 'Riverside Resort & Spa',
      type: 'Resort',
      location: 'Dupinga River',
      price: '₱3,500/night',
      rating: 4.9,
      reviews: 45,
      bookings: 23,
      image: '/api/placeholder/300/200'
    },
    {
      id: '2',
      name: 'Mountain View Cottages',
      type: 'Cottage',
      location: 'Sierra Madre',
      price: '₱2,200/night',
      rating: 4.7,
      reviews: 32,
      bookings: 18,
      image: '/api/placeholder/300/200'
    },
    {
      id: '3',
      name: 'Falls Edge Restaurant',
      type: 'Restaurant',
      location: 'Gabaldon Falls',
      price: '₱450/meal',
      rating: 4.6,
      reviews: 67,
      bookings: 89,
      image: '/api/placeholder/300/200'
    }
  ];

  const recentBookings = [
    {
      id: '1',
      customer: 'Maria Santos',
      listing: 'Riverside Resort',
      date: '2024-01-25',
      guests: 4,
      total: '₱7,000',
      status: 'confirmed'
    },
    {
      id: '2',
      customer: 'John Cruz',
      listing: 'Mountain View Cottages',
      date: '2024-01-28',
      guests: 2,
      total: '₱4,400',
      status: 'pending'
    },
    {
      id: '3',
      customer: 'Ana Reyes',
      listing: 'Falls Edge Restaurant',
      date: '2024-01-20',
      guests: 6,
      total: '₱2,700',
      status: 'completed'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'listings', label: 'My Listings', icon: Store },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Business
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
              Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage your tourism business listings and bookings
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-xs text-primary">{stat.change}</p>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <Button className="btn-ios h-16 flex-col gap-2">
                  <Plus className="w-6 h-6" />
                  Add New Listing
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2 bg-white/80 backdrop-blur-sm">
                  <Calendar className="w-6 h-6" />
                  Manage Bookings
                </Button>
                <Button variant="outline" className="h-16 flex-col gap-2 bg-white/80 backdrop-blur-sm">
                  <MessageCircle className="w-6 h-6" />
                  View Reviews
                </Button>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {booking.customer.split(' ').map(n => n[0]).join('')}
                            </div>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{booking.customer}</p>
                            <p className="text-xs text-muted-foreground">{booking.listing}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{booking.total}</p>
                          <Badge
                            className={`text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Performance Chart */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Performance
                  </h3>
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                    <p className="text-muted-foreground">Revenue Chart Placeholder</p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Listings Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">My Listings</h2>
                <Button className="btn-ios">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Listing
                </Button>
              </div>

              {/* Listings Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing, index) => (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="glass-card overflow-hidden group">
                      <div className="relative h-48">
                        <img
                          src={listing.image}
                          alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <Button size="icon" variant="ghost" className="w-8 h-8 bg-white/80 text-gray-700 hover:bg-white">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="w-8 h-8 bg-white/80 text-gray-700 hover:bg-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{listing.rating}</span>
                          </div>
                          <Badge className="bg-white/90 text-gray-800 text-xs">
                            {listing.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{listing.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-4 h-4" />
                          {listing.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-primary">{listing.price}</p>
                            <p className="text-xs text-muted-foreground">{listing.reviews} reviews</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            {listing.bookings} bookings
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Other tabs content */}
          {activeTab !== 'overview' && activeTab !== 'listings' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-12"
            >
              <Card className="glass-card p-12 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">{tabs.find(t => t.id === activeTab)?.label} Section</h3>
                <p className="text-muted-foreground mb-4">
                  This section is under development with modern iOS-style design
                </p>
                <Button className="btn-ios">
                  Coming Soon
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedBusinessDashboard;
