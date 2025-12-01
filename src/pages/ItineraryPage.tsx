import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ItineraryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-4">My Itineraries</h1>
          <p className="text-muted-foreground mb-8">Plan your perfect Gabaldon adventure</p>
          <Button className="bg-gradient-primary text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create New Trip
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ItineraryPage;