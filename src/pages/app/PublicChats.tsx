import React, { useState, useMemo } from 'react';
import { mockMessages, mockUsers, getCurrentUser, touristSpots } from '@/mock-data/mockData';
import { Message, User } from '@/types/publickChatType';
import TouristSpotHeader from '@/components/public-chats/TouristSpotHeader';
import ChatInput from '@/components/public-chats/ChatInput';
import ChatMessage from '@/components/public-chats/ChatMessage';

function PublicChats() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [currentUser] = useState<User>(getCurrentUser());
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  // Filter messages based on active spot
  const filteredMessages = useMemo(() => {
    if (!activeSpot) return [];
    return messages.filter(message => message.spotId === activeSpot);
  }, [messages, activeSpot]);

  // Update tourist spots with message counts
  const spotsWithCounts = useMemo(() => {
    return touristSpots.map(spot => ({
      ...spot,
      messageCount: messages.filter(msg => msg.spotId === spot.id).length,
    }));
  }, [messages]);

  const handleSendMessage = (content: string, image?: string) => {
    if (!activeSpot) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      user: currentUser,
      content,
      image,
      timestamp: new Date(),
      replies: [],
      likes: 0,
      likedBy: [],
      spotId: activeSpot,
    };

    setMessages(prev => [newMessage, ...prev]);
  };

  const handleReply = (messageId: string, content: string, image?: string) => {
    if (!activeSpot) return;

    const newReply: Message = {
      id: `${messageId}-${Date.now()}`,
      user: currentUser,
      content,
      image,
      timestamp: new Date(),
      replies: [],
      likes: 0,
      likedBy: [],
      spotId: activeSpot,
    };

    setMessages(prev =>
      prev.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            replies: [...message.replies, newReply],
          };
        }
        return message;
      })
    );
  };

  const handleLike = (messageId: string) => {
    setMessages(prev =>
      prev.map(message => {
        if (message.id === messageId) {
          const isLiked = message.likedBy.includes(currentUser.id);
          return {
            ...message,
            likes: isLiked ? message.likes - 1 : message.likes + 1,
            likedBy: isLiked
              ? message.likedBy.filter(id => id !== currentUser.id)
              : [...message.likedBy, currentUser.id],
          };
        }
        // Handle replies
        return {
          ...message,
          replies: message.replies.map(reply => {
            if (reply.id === messageId) {
              const isLiked = reply.likedBy.includes(currentUser.id);
              return {
                ...reply,
                likes: isLiked ? reply.likes - 1 : reply.likes + 1,
                likedBy: isLiked
                  ? reply.likedBy.filter(id => id !== currentUser.id)
                  : [...reply.likedBy, currentUser.id],
              };
            }
            return reply;
          }),
        };
      })
    );
  };

  const handleSpotSelect = (spotId: string) => {
    setActiveSpot(spotId || null);
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <TouristSpotHeader
        spots={spotsWithCounts}
        activeSpot={activeSpot}
        onSpotSelect={handleSpotSelect}
        messageCount={filteredMessages.length}
      />

      <div className="max-w-4xl mx-auto px-4">
        {!activeSpot ? (
          // Welcome Screen
          <div className="text-center py-5">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <img src="/gabaldon-bg.jpg" className='w-32 h-32 rounded-full mx-auto mb-7' alt="" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Gabaldon Tourist Spots
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Discover amazing tourist destinations in Gabaldon, Nueva Ecija.
                Share your experiences, read reviews, and connect with fellow
                travelers!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spotsWithCounts.map((spot) => (
                  <div
                    key={spot.id}
                    onClick={() => handleSpotSelect(spot.id)}
                    className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
                  >
                    <img
                      src={spot.image}
                      alt={spot.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {spot.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {spot.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-medium">
                          {spot.messageCount} messages
                        </span>
                        <button className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/50 transition-colors">
                          View Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Input */}
            <ChatInput
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              activeSpot={activeSpot}
            />

            {/* Messages Feed */}
            <div className="space-y-0">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No messages yet
                  </h3>
                  <p className="text-gray-400">
                    Be the first to share your experience about this spot!
                  </p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    currentUser={currentUser}
                    onReply={handleReply}
                    onLike={handleLike}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Discover the beauty of Gabaldon, Nueva Ecija 🌿
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PublicChats;