import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  Star, Send } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useGetPlaces } from "@/hooks/useGetPlace";
import { useRatings } from "@/hooks/useRating";
import { useAuth2 } from "@/hooks/useAuth";
import { createRatingApi } from "@/api/ratingApi";
import type { RatingRaw } from "@/types/rating";
import BackButton from "@/components/ui/BackButton";

type Review = {
  id: string;
  userId?: number;
  userName?: string;
  rating: number;
  comments: string;
  date: string;
  imageUrl?: string | null;
  isAnonymous?: boolean;
};

const toBool = (v: any) => {
  if (v === true || v === 1) return true;
  if (v === false || v === 0) return false;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1") return true;
    return false;
  }
  return Boolean(v);
};

const mapRawToReview = (r: RatingRaw | any, idx = 0): Review => {
  const raw = r as any;
  const isAnonymous = toBool(raw.is_anonymous ?? raw.isAnonymous ?? false);
  const user = raw.user ?? {};
  const first = user.first_name ?? user.firstName ?? "";
  const last = user.last_name ?? user.lastName ?? "";
  const name =
    first || last
      ? `${first} ${last}`.trim()
      : user.name ?? user.username ?? "Anonymous";
  return {
    id: String(raw.id ?? raw.uuid ?? `r-${Date.now()}-${idx}`),
    userId: raw.user_id ?? user.id,
    userName: isAnonymous ? "Anonymous" : name,
    rating: Number(raw.rating ?? raw.ratings ?? 0) || 0,
    comments: raw.description ?? raw.comments ?? raw.comment ?? "",
    date: raw.created_at ?? raw.createdAt ?? new Date().toISOString(),
    imageUrl: isAnonymous
      ? null
      : user.profile_url ??
        user.profileUrl ??
        raw.image_url ??
        raw.imageUrl ??
        null,
    isAnonymous,
  };
};

const sortByDateDesc = (arr: Review[]) =>
  arr.slice().sort((a, b) => +new Date(b.date) - +new Date(a.date));

const RatingsPage: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { formatData: places = [], isLoading: placesLoading } = useGetPlaces();
  const { data } = useRatings(spotId ?? null);
  const { user } = useAuth2();

  const reviewsRaw = Array.isArray(data)
    ? data
        .slice()
        .sort(
          (a: any, b: any) =>
            +new Date(b.created_at ?? b.createdAt) -
            +new Date(a.created_at ?? a.createdAt)
        )
    : [];
  const reviewsMapped = reviewsRaw.map((r: any, i: number) =>
    mapRawToReview(r, i)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    sortByDateDesc(reviewsMapped)
  );
  useEffect(() => setReviews(sortByDateDesc(reviewsMapped)), [data]);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [postAnonymous, setPostAnonymous] = useState(false);

  const qc = useQueryClient();

  type Payload = {
    touristspot_id: number;
    rating: number;
    description: string;
    is_anonymous: boolean;
  };

  const mutation = useMutation({
    mutationFn: (payload: Payload) => createRatingApi(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ratings"] });
    },
  });

  const total = reviews.reduce((acc, r) => acc + Number(r.rating ?? 0), 0);
  const avg = reviews.length ? (total / reviews.length).toFixed(1) : "0.0";
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => Number(r.rating) === star).length
  );

  const place: any =
    places.find((p: any) => String(p.id) === String(spotId)) ??
    places.find((p: any) => String(p.placeId) === String(spotId)) ??
    places.find((p: any) => String(p.raw?.id) === String(spotId)) ??
    reviewsRaw[0]?.tourist_spot ??
    null;

  if (!reviewsRaw && !placesLoading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Spot not found</h2>
          <Button onClick={() => navigate("/app")}>Go back to home</Button>
        </div>
      </div>
    );
  }

  const handleSubmitReview = () => {
    if (!spotId || !newComment.trim() || newRating <= 0) return;
    mutation.mutate({
      touristspot_id: Number(spotId),
      rating: newRating,
      description: newComment.trim(),
      is_anonymous: postAnonymous,
    });
    setNewComment("");
    setNewRating(0);
    setPostAnonymous(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="bg-gradient-primary px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <BackButton />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">
                {place?.name ?? `Spot ${spotId}`}
              </h1>
              <p className="text-white/80 text-sm truncate">
                Reviews & Ratings
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-white/90 text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{avg}</span>
              </div>
              <Badge className="bg-white/10 text-white">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>

          <Card className="glass-premium p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-1">
                  {avg}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= Math.round(Number(avg))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {reviews.length} total
                </p>
              </div>

              <div className="flex-1 w-full">
                {[5, 4, 3, 2, 1].map((rating, idx) => {
                  const count = ratingCounts[idx];
                  const percentage = reviews.length
                    ? (count / reviews.length) * 100
                    : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-4">{rating}</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Share Your Experience</h3>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Rate this place</p>
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${star}`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= newRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {postAnonymous ? "Posting anonymously" : "Post with name"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPostAnonymous((v) => !v)}
                    aria-pressed={postAnonymous}
                    className={`relative w-12 h-6 flex items-center rounded-full transition-colors duration-300 ${
                      postAnonymous ? "bg-primary/60" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        postAnonymous ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <Textarea
              placeholder="Share your experience about this place..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-4 min-h-[96px] rounded-xl"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={
                  !newComment.trim() || newRating === 0 || mutation.isPending
                }
                className="btn-ios"
              >
                <Send className="w-4 h-4 mr-2" />
                {mutation.isPending ? "Posting..." : "Post Review"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setNewComment("");
                  setNewRating(0);
                  setPostAnonymous(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {reviews.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="glass-card p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-10 h-10">
                    <img
                      src={comment.imageUrl ?? "/mockProfile.jpg"}
                      alt={comment.userName ?? "User"}
                    />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm truncate">
                        {comment.userName ?? "Anonymous"}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= comment.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-0 leading-relaxed">
                      {comment.comments}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;
