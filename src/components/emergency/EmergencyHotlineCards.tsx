import { useState } from "react";
import { Phone, MessageCircle, Star, Copy } from "lucide-react";
import { motion } from "framer-motion";
import type { EmergencyHotline } from "@/data/emergencyHotlines";

type EmergencyHotlineCardsProps = {
  hotlines: EmergencyHotline[];
};

/**
 * Shared emergency contact cards — same markup and styles as the full Hotlines page.
 */
export default function EmergencyHotlineCards({
  hotlines,
}: EmergencyHotlineCardsProps) {
  const [favorites, setFavorites] = useState<number[]>([]);

  function toggleFavorite(id: number) {
    setFavorites((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
      {hotlines.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-2xl p-4 shadow-sm flex gap-4"
        >
          <img src={h.img} alt={h.name} className="w-14 h-14 rounded-full" />

          <div className="flex-1">
            <div className="flex justify-between">
              <h3 className="font-semibold">{h.name}</h3>

              <button
                type="button"
                onClick={() => toggleFavorite(h.id)}
                className="p-1"
                aria-label={
                  favorites.includes(h.id) ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Star
                  size={16}
                  className={
                    favorites.includes(h.id)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            </div>

            <p className="text-sm text-slate-500">{h.description}</p>

            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  window.location.href = `tel:${h.phone}`;
                }}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm"
              >
                <Phone size={14} />
                Call
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `sms:${h.sms}`;
                }}
                className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
              >
                <MessageCircle size={14} />
                Message
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(h.phone)}
                className="p-2 border rounded-lg"
                aria-label="Copy phone number"
              >
                <Copy size={14} />
              </button>
            </div>

            <div className="mt-3 flex gap-2 flex-wrap">
              {h.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
