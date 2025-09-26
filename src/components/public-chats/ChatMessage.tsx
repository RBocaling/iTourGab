import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react';
import { Message, User } from '@/types/publickChatType';

interface ChatMessageProps {
  message: Message;
  currentUser: User;
  onReply: (messageId: string, content: string, image?: string) => void;
  onLike: (messageId: string) => void;
  isReply?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUser,
  onReply,
  onLike,
  isReply = false,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replyImage, setReplyImage] = useState<string>('');

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleReplySubmit = () => {
    if (replyContent.trim() || replyImage) {
      onReply(message.id, replyContent, replyImage);
      setReplyContent('');
      setReplyImage('');
      setShowReplyInput(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReplyImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isLikedByCurrentUser = message.likedBy.includes(currentUser.id);

  return (
    <div className={`${isReply ? 'ml-12 mt-3' : 'mb-6'} transition-all duration-200 hover:shadow-lg`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {/* User Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={message.user.avatar}
                alt={message.user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-green-200 shadow-sm"
              />
              {message.user.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">{message.user.name}</h4>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock size={12} />
                <span>{formatTimeAgo(message.timestamp)}</span>
              </div>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Message Content */}
        <div className="mb-3">
          <p className="text-gray-800 leading-relaxed">{message.content}</p>
          {message.image && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img
                src={message.image}
                alt="Shared content"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(message.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                isLikedByCurrentUser
                  ? 'bg-green-50 text-primary hover:bg-green-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <Heart
                size={16}
                className={isLikedByCurrentUser ? 'fill-current' : ''}
              />
              <span className="text-sm font-medium">{message.likes}</span>
            </button>

            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary transition-all"
            >
              <MessageCircle size={16} />
              <span className="text-sm font-medium">{message.replies.length}</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-500 hover:bg-gray-50 hover:text-primary transition-all">
              <Share size={16} />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>

        {/* Reply Input */}
        {showReplyInput && (
          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex items-start space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                />
                {replyImage && (
                  <div className="mt-2 relative inline-block">
                    <img
                      src={replyImage}
                      alt="Reply attachment"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setReplyImage('')}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                )}
                <div className="flex items-center justify-between mt-2">
                  <label className="cursor-pointer text-primary hover:text-green-700 text-sm font-medium">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    📷 Add Photo
                  </label>
                  <div className="space-x-2">
                    <button
                      onClick={() => setShowReplyInput(false)}
                      className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim() && !replyImage}
                      className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {message.replies.length > 0 && (
        <div className="space-y-3 mt-3">
          {message.replies.map((reply) => (
            <ChatMessage
              key={reply.id}
              message={reply}
              currentUser={currentUser}
              onReply={onReply}
              onLike={onLike}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;