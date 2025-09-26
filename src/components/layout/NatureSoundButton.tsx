import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

const NatureSoundButton: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for nature sounds
    // In a real app, you would have actual nature sound files
    // For now, we'll simulate with a placeholder
    audioRef.current = new Audio();
    
    // Placeholder - in production, use actual nature sound files
    audioRef.current.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGMcBjaS2O/NeSsFKIXL8dqLNwgZaLvt559NEAxPqOPwtmQcBzqM2/LLdiwED3zA6N6MQAoRX7bp7ahVFAlHoOH0wGAcBzaQ2O7BeiwEInTF8N2QQAoUXrXk7KlTFAlDneHzwWAcBzuS2e7BeiwEJnfJ8dh/PwsWbL3n4oU+IQs2jN3yzXssCGuxva6cZh4aX7rt5ys8KAsPn9ztoZXCfH1jT0ksEMOg7d0l5W3eqntnqWr1v9Zd9jPjN1Cxa8f8ZtSr0G4Qr8HTfpWR4ug6mKnr+jnl3bOh49w5ZNGltJnrRltPMFBqT06V+jYfN2yG3K7Qo5A3rCbC3w6MIFMr6O5fLp3CG8iTOd7r3kZ8aQ6Ck0IKLNdT8V5BNLBxZGElA+tG0sTiLNGxWaKa1b4gVjcSXYnc7HkRj1z7t3n1J3o1Q6HqYKbKTu6Rr2sWXKO5f5jI3jH0T9RB1szcT9BhXbfqJAqzpM5";
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleSound}
      className="sound-btn"
      title={isPlaying ? 'Mute nature sounds' : 'Play nature sounds'}
    >
      {isPlaying ? (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Volume2 className="w-5 h-5" />
        </motion.div>
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
      
      {/* Sound Wave Animation */}
      {isPlaying && (
        <div className="absolute -inset-2 rounded-full">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border border-accent/30"
              animate={{
                scale: [1, 2, 3],
                opacity: [0.8, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
        </div>
      )}
    </motion.button>
  );
};

export default NatureSoundButton;