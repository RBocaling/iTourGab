import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, MapPin, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage iTourGab platform</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold">Users</h3>
            <p className="text-2xl font-bold text-primary">1,234</p>
          </Card>
          <Card className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h3 className="font-bold">Destinations</h3>
            <p className="text-2xl font-bold text-primary">10</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;