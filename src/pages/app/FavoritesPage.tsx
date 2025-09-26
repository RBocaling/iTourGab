import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FavoritesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-3xl font-bold mb-4">My Favorites</h1>
          <p className="text-muted-foreground">Your saved destinations</p>
        </motion.div>
      </div>
    </div>
  );
};

export default FavoritesPage;