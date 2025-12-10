import React, { useState } from "react";
import { Phone, MessageCircle, Search, Star, Copy, Globe } from "lucide-react";
import { motion } from "framer-motion";
// Import the banner image. Put the provided image file in your project's assets folder.
// Example paths:
//  - Vite/CRA: import banner from "../assets/gabaldon-hotlines.png";
//  - If you're testing locally with the provided container image path, you can use:
import banner from "/banner.png";

// Updated default hotlines to match the image values, same structure & tags kept
const defaultHotlines = [
  {
    id: 1,
    name: "Gabaldon Police Station",
    phone: "0998-598-5427",
    sms: "0998-598-5427",
    whatsapp: "",
    img: "/pnp.png",
    description: "Police assistance — immediate response.",
    tags: ["Police", "24/7"],
  },
  {
    id: 2,
    name: "Gabaldon Fire Station",
    phone: "0942-715-2383",
    sms: "0942-715-2383",
    whatsapp: "",
    img: "/bir.png",
    description: "Fire emergencies & rescue.",
    tags: ["Fire", "Rescue"],
  },
  {
    id: 3,
    name: "Gabaldon MDRRMO",
    phone: "0907-073-4444",
    sms: "0907-073-4444",
    whatsapp: "",
    img: "/mdrrmo.png",
    description: "Municipal Disaster Risk Reduction & Management Office.",
    tags: ["Disaster", "MDRRMO"],
  },
  {
    id: 4,
    name: "Gabaldon RHU",
    phone: "0977-843-2376",
    sms: "0977-843-2376",
    whatsapp: "",
    img: "/health.png",
    description: "Rural Health Unit — medical & health support.",
    tags: ["Health", "RHU"],
  },
];

export default function EmergencyHotlines({ hotlines = defaultHotlines }) {
  const [q, setQ] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filtered = hotlines.filter((h) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    return (
      h.name.toLowerCase().includes(term) ||
      h.description.toLowerCase().includes(term) ||
      h.phone.toLowerCase().includes(term) ||
      (h.tags || []).join(" ").toLowerCase().includes(term)
    );
  });

  function toggleFavorite(id: number) {
    setFavorites((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard?.writeText(text).then(() => {
      const el = document.createElement("div");
      el.textContent = `Copied ${text}`;
      el.setAttribute("role", "status");
      el.className =
        "fixed bottom-6 left-1/2 transform -translate-x-1/2 rounded-xl px-4 py-2 text-sm bg-white/90 shadow-md";
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 1500);
    });
  }

  return (
    <div className="min-h-screen md:mt-20 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-7xl">
        <header className="sticky top-6 z-10">
          <div className="flex md:flex-row flex-col items-center justify-between gap-3 p-4  ">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Emergency Hotlines
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Tap to call or message — opens your phone apps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search (name, number, tag)"
                  className="w-72 pl-10 pr-4 py-2 rounded-full bg-slate-50 border border-slate-100 shadow-inner text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Banner image (same visual design, added image) */}
          {/* <div className="mt-4">
            <img
              src={banner}
              alt="Gabaldon hotlines banner"
              className="w-full rounded-2xl  object-cover max-h-52 sm:max-h-64"
            />
          </div> */}
        </header>

        <main className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2">
          {filtered.map((h) => (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              whileHover={{ translateY: -4 }}
              className="relative rounded-2xl overflow-hidden"
            >
              <div
                className="absolute inset-0 pointer-events-none blur-2xl opacity-30"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(99,102,241,0.12), rgba(56,189,248,0.08))",
                }}
              />

              <div className="relative z-10 bg-white/90 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] flex items-start gap-4">
                <div className="flex-shrink-0">
                      <img src={h?.img} className="w-14 h-14 rounded-full" alt="" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold leading-tight">
                        {h.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {h.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFavorite(h.id)}
                        aria-pressed={favorites.includes(h.id)}
                        className="p-2 rounded-lg hover:bg-slate-50 transition"
                        title="Favorite"
                      >
                        <Star
                          size={16}
                          className={
                            favorites.includes(h.id)
                              ? "text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${h.phone}`}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-primary text-white border-primary/20 shadow-sm text-sm font-medium hover:brightness-95 transition"
                        rel="noopener noreferrer"
                        aria-label={`Call ${h.name}`}
                      >
                        <Phone size={16} />
                        Call
                      </a>

                      <a
                        href={`sms:${h.sms}?body=${encodeURIComponent(
                          "Hello, I need assistance"
                        )}`}
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-b from-slate-50 to-white border border-slate-100 shadow-sm text-sm font-medium hover:brightness-95 transition"
                        rel="noopener noreferrer"
                        aria-label={`Message ${h.name}`}
                      >
                        <MessageCircle size={16} />
                        Message
                      </a>

                      {h.whatsapp ? (
                        <a
                          href={`https://wa.me/${h.whatsapp.replace(
                            /[^0-9]/g,
                            ""
                          )}?text=${encodeURIComponent(
                            "Hello, I need assistance"
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-white border border-slate-100 shadow-sm text-sm font-medium hover:brightness-95 transition"
                        >
                          <Globe size={14} />
                          WhatsApp
                        </a>
                      ) : null}

                      <button
                        onClick={() => copyToClipboard(h.phone)}
                        className="p-2 rounded-lg hover:bg-slate-50 transition"
                        aria-label={`Copy ${h.phone}`}
                        title="Copy number"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-400">Number</span>
                      <div className="rounded-full px-3 py-1 bg-slate-50 border border-slate-100 text-sm font-medium">
                        {h.phone}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2 flex-wrap">
                    {(h.tags || []).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-1 rounded-full bg-indigo-50/60 text-indigo-700 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}

          {filtered.length === 0 && (
            <div className="p-8 rounded-2xl bg-white/90 backdrop-blur-sm border border-slate-100 text-center text-slate-500 shadow-sm">
              No results. Try another search term.
            </div>
          )}

          <footer className="text-center text-xs text-slate-400 mt-2">
            If this is an emergency, call your local emergency number
            immediately.
          </footer>
        </main>
      </div>
    </div>
  );
}
