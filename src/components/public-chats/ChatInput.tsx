import React, { useState } from 'react';
import { Send, Image, Smile } from 'lucide-react';
import { User } from '@/types/publickChatType';

interface ChatInputProps {
  currentUser: User;
  onSendMessage: (content: string, image?: string) => void;
  activeSpot: string | null;
}

const ChatInput: React.FC<ChatInputProps> = ({ currentUser, onSendMessage, activeSpot }) => {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || image) && activeSpot) {
      onSendMessage(message, image);
      setMessage('');
      setImage('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {!activeSpot && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              Please select a tourist spot to start chatting about your experience!
            </p>
          </div>
        )}
        <div className="flex items-start space-x-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 mt-1"
          />
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={activeSpot ? "Share your experience about this spot..." : "Select a tourist spot first..."}
              disabled={!activeSpot}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              rows={3}
            />
            
            {image && (
              <div className="mt-3 relative inline-block">
                <img
                  src={image}
                  alt="Upload preview"
                  className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Image size={18} />
                  <span className="text-sm font-medium">Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={!activeSpot}
                    className="hidden"
                  />
                </label>
                
                <button
                  type="button"
                  className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
                >
                  <Smile size={18} />
                  <span className="text-sm font-medium">Feeling</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={(!message.trim() && !image) || !activeSpot}
                className="flex items-center space-x-2 px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <Send size={16} />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;