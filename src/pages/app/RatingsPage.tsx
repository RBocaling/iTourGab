import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MessageCircle, ThumbsUp, Reply, Send, MoreVertical } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { touristSpots } from '@/data/touristSpots';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  rating: number;
  comment: string;
  date: string;
  likes: number;
  replies: Reply[];
  liked?: boolean;
}

interface Reply {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  comment: string;
  date: string;
  likes: number;
  liked?: boolean;
}

const RatingsPage: React.FC = () => {
  const { spotId } = useParams();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const spot = touristSpots.find(s => s.id === spotId);

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        name: 'Maria Santos',
        avatar: '/mockProfile.jpg',
        verified: true
      },
      rating: 5,
      comment: 'Amazing place! The water is crystal clear and perfect for swimming. Highly recommend visiting during early morning for the best experience.',
      date: '2 days ago',
      likes: 24,
      liked: false,
      replies: [
        {
          id: '1-1',
          user: {
            name: 'John Cruz',
            avatar: '/mockProfile.jpg'
          },
          comment: 'Thanks for the tip! Planning to visit this weekend.',
          date: '1 day ago',
          likes: 3,
          liked: false
        }
      ]
    },
    {
      id: '2',
      user: {
        name: 'Carlos Reyes',
        avatar: '/mockProfile.jpg',
        verified: false
      },
      rating: 4,
      comment: 'Beautiful scenery and peaceful environment. The trek is moderate but worth it. Bring water and snacks!',
      date: '1 week ago',
      likes: 18,
      liked: true,
      replies: []
    },
    {
      id: '3',
      user: {
        name: 'Ana Dela Cruz',
        avatar: '/mockProfile.jpg',
        verified: true
      },
      rating: 5,
      comment: 'Perfect spot for families! Kids loved the shallow areas for swimming. Clean facilities and friendly locals.',
      date: '2 weeks ago',
      likes: 31,
      liked: false,
      replies: []
    }
  ]);

  if (!spot) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Spot not found</h2>
          <Button onClick={() => navigate('/app')}>Go back to home</Button>
        </div>
      </div>
    );
  }

  const averageRating = comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length;

  const handleLike = (commentId: string, isReply = false, replyId?: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId && !isReply) {
        return {
          ...comment,
          liked: !comment.liked,
          likes: comment.liked ? comment.likes - 1 : comment.likes + 1
        };
      }
      if (isReply && replyId) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === replyId) {
              return {
                ...reply,
                liked: !reply.liked,
                likes: reply.liked ? reply.likes - 1 : reply.likes + 1
              };
            }
            return reply;
          })
        };
      }
      return comment;
    }));
  };

  const handleSubmitComment = () => {
    if (newComment.trim() && newRating > 0) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar: '/mockProfile.jpg',
          verified: false
        },
        rating: newRating,
        comment: newComment,
        date: 'Just now',
        likes: 0,
        replies: [],
        liked: false
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setNewRating(0);
    }
  };

  const handleReply = (commentId: string) => {
    if (replyText.trim()) {
      const reply: Reply = {
        id: `${commentId}-${Date.now()}`,
        user: {
          name: 'You',
          avatar: '/mockProfile.jpg'
        },
        comment: replyText,
        date: 'Just now',
        likes: 0,
        liked: false
      };

      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      }));

      setReplyText('');
      setReplyTo(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-primary px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{spot.name}</h1>
              <p className="text-white/80 text-sm">Reviews & Ratings</p>
            </div>
          </div>

          {/* Overall Rating */}
          <Card className="glass-premium p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {comments.length} review{comments.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = comments.filter(c => c.rating === rating).length;
                  const percentage = comments.length > 0 ? (count / comments.length) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-4">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Add Review */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Share Your Experience</h3>
            
            {/* Rating Input */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Rate this place:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= newRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Input */}
            <Textarea
              placeholder="Share your experience about this place..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 min-h-[100px] rounded-xl"
            />

            <Button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || newRating === 0}
              className="btn-ios"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Review
            </Button>
          </Card>
        </motion.div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="glass-card p-6">
                {/* Comment Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-10 h-10">
                    <img src={comment.user.avatar} alt={comment.user.name} />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{comment.user.name}</h4>
                      {comment.user.verified && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          ✓ Verified
                        </Badge>
                      )}
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= comment.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {/* Comment Content */}
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {comment.comment}
                </p>

                {/* Comment Actions */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      comment.liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${comment.liked ? 'fill-current' : ''}`} />
                    {comment.likes}
                  </button>
                  <button
                    onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                </div>

                {/* Reply Input */}
                <AnimatePresence>
                  {replyTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <div className="flex gap-3 p-4 bg-muted/30 rounded-xl">
                        <Avatar className="w-8 h-8">
                          <img src="/api/placeholder/32/32" alt="You" />
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="mb-2 min-h-[60px] text-sm"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyText.trim()}
                              className="h-8 px-3 text-xs"
                            >
                              Reply
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyTo(null)}
                              className="h-8 px-3 text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="space-y-3 ml-4 border-l-2 border-muted pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <img src={reply.user.avatar} alt={reply.user.name} />
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium text-sm">{reply.user.name}</h5>
                            <span className="text-xs text-muted-foreground">{reply.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{reply.comment}</p>
                          <button
                            onClick={() => handleLike(comment.id, true, reply.id)}
                            className={`flex items-center gap-1 text-xs transition-colors ${
                              reply.liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                            }`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${reply.liked ? 'fill-current' : ''}`} />
                            {reply.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;