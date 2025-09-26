import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  Calendar, 
  Settings, 
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Star,
  TrendingUp,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { touristSpots } from '@/data/touristSpots';

const EnhancedAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    {
      title: 'Total Destinations',
      value: touristSpots.length,
      change: '+12%',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Bookings',
      value: '247',
      change: '+18%',
      icon: Calendar,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Revenue',
      value: '₱125,430',
      change: '+24%',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'User Reviews',
      value: '1,234',
      change: '+8%',
      icon: MessageSquare,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentBookings = [
    {
      id: '1',
      user: 'Maria Santos',
      destination: 'Dupinga River',
      date: '2024-01-20',
      status: 'confirmed',
      amount: '₱2,500'
    },
    {
      id: '2',
      user: 'John Cruz',
      destination: 'Gabaldon Falls',
      date: '2024-01-18',
      status: 'pending',
      amount: '₱3,200'
    },
    {
      id: '3',
      user: 'Ana Reyes',
      destination: 'Sierra Madre',
      date: '2024-01-15',
      status: 'completed',
      amount: '₱4,100'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
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
            Admin
            <span className="bg-gradient-primary bg-clip-text text-transparent ml-2">
              Dashboard
            </span>
          </h1>
          <p className="text-muted-foreground">
            Manage iTourGab destinations, bookings, and user experience
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-white/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 flex-1 text-center ${
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
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </Card>
                ))}
              </div>

              {/* Charts & Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Revenue Trends
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                    <p className="text-muted-foreground">Interactive Chart Placeholder</p>
                  </div>
                </Card>

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
                              {booking.user.split(' ').map(n => n[0]).join('')}
                            </div>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{booking.user}</p>
                            <p className="text-xs text-muted-foreground">{booking.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{booking.amount}</p>
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
              </div>
            </motion.div>
          )}

          {activeTab === 'destinations' && (
            <motion.div
              key="destinations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Destinations Header */}
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search destinations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button className="btn-ios">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </Button>
              </div>

              {/* Destinations Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {touristSpots.slice(0, 6).map((spot, index) => (
                  <motion.div
                    key={spot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="glass-card overflow-hidden group">
                      <div className="relative h-48">
                        <img
                          src={spot.images[0]}
                          alt={spot.name}
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
                          <Button size="icon" variant="ghost" className="w-8 h-8 bg-white/80 text-red-600 hover:bg-white">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                          <div className="bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{spot.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{spot.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {spot.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <Badge className="capitalize">{spot.category}</Badge>
                          <span className="text-muted-foreground">{spot.reviews} reviews</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Other tabs content would go here */}
          {activeTab !== 'overview' && activeTab !== 'destinations' && (
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

export default EnhancedAdminDashboard;
