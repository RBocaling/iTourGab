import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Search,
  Star,
  Copy,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const defaultHotlines = [
  {
    id: 1,
    name: "Gabaldon Police Station",
    phone: "0998-598-5427",
    sms: "0998-598-5427",
    img: "/pnp.png",
    description: "Police assistance — immediate response.",
    tags: ["Police", "24/7"],
  },
  {
    id: 2,
    name: "Gabaldon Fire Station",
    phone: "0942-715-2383",
    sms: "0942-715-2383",
    img: "/bir.png",
    description: "Fire emergencies & rescue.",
    tags: ["Fire", "Rescue"],
  },
  {
    id: 3,
    name: "Gabaldon MDRRMO",
    phone: "0907-073-4444",
    sms: "0907-073-4444",
    img: "/mdrrmo.png",
    description: "Municipal Disaster Risk Reduction & Management Office.",
    tags: ["Disaster", "MDRRMO"],
  },
  {
    id: 4,
    name: "Gabaldon RHU",
    phone: "0977-843-2376",
    sms: "0977-843-2376",
    img: "/health.png",
    description: "Rural Health Unit — medical & health support.",
    tags: ["Health", "RHU"],
  },
];

const safetyGuidelines = [
  {
    title: "Earthquake Safety",
    content: [
      "Drop, Cover, and Hold.",
      "Stay away from windows and heavy objects.",
      "Evacuate calmly after shaking stops.",
    ],
  },
  {
    title: "Flood Safety",
    content: [
      "Move to higher ground immediately.",
      "Avoid rivers and flooded roads.",
      "Follow local evacuation instructions.",
    ],
  },
  {
    title: "Typhoon Safety",
    content: [
      "Stay indoors during strong winds.",
      "Avoid sea travel.",
      "Monitor official weather advisories.",
    ],
  },
  {
    title: "Medical Emergency",
    content: [
      "Call the nearest hospital or RHU.",
      "Provide first aid if trained.",
      "Stay calm and wait for responders.",
    ],
  },
];

const faq = [
  {
    q: "What should I do during an emergency?",
    a: "Stay calm, contact emergency services immediately, and follow instructions from local authorities.",
  },
  {
    q: "Where can I find emergency contacts?",
    a: "Use the Emergency Contacts tab to quickly call police, fire, or medical services.",
  },
  {
    q: "Is there medical assistance available for tourists?",
    a: "Yes. The Rural Health Unit (RHU) provides medical support.",
  },
];

export default function EmergencyHotlines({ hotlines = defaultHotlines }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"contacts" | "safety" | "faq">("contacts");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filtered = hotlines.filter((h) => {
    const term = q.toLowerCase();
    return (
      h.name.toLowerCase().includes(term) ||
      h.phone.includes(term) ||
      h.description.toLowerCase().includes(term)
    );
  });

  function toggleFavorite(id: number) {
    setFavorites((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="min-h-screen md:mt-20 bg-slate-50 p-4 md:p-6 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* HEADER */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Emergency & Safety</h1>
            <p className="text-sm text-slate-500">
              Emergency contacts and safety information for tourists.
            </p>
          </div>

          {tab === "contacts" && (
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search (name, number)"
                className="w-64 pl-10 pr-4 py-2 rounded-full border text-sm"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          )}
        </header>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setTab("contacts")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "contacts" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Emergency Contacts
          </button>

          <button
            onClick={() => setTab("safety")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "safety" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Safety & Preparedness
          </button>

          <button
            onClick={() => setTab("faq")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "faq" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Emergency FAQ
          </button>
        </div>

        {/* CONTACTS TAB */}
        {tab === "contacts" && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {filtered.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-2xl p-4 shadow-sm flex gap-4"
              >
                <img src={h.img} className="w-14 h-14 rounded-full" />

                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">{h.name}</h3>

                    <button
                      onClick={() => toggleFavorite(h.id)}
                      className="p-1"
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
                    <a
                      href={`tel:${h.phone}`}
                      className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg text-sm"
                    >
                      <Phone size={14} />
                      Call
                    </a>

                    <a
                      href={`sms:${h.sms}`}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm"
                    >
                      <MessageCircle size={14} />
                      Message
                    </a>

                    <button
                      onClick={() => copyToClipboard(h.phone)}
                      className="p-2 border rounded-lg"
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
        )}

        {/* SAFETY TAB */}
        {tab === "safety" && (
          <div className="grid md:grid-cols-2 gap-6">
            {safetyGuidelines.map((g, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-red-500" size={18} />
                  <h3 className="font-semibold">{g.title}</h3>
                </div>

                <ul className="text-sm text-slate-600 space-y-1">
                  {g.content.map((c, idx) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* FAQ TAB */}
        {tab === "faq" && (
          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((f, i) => (
              <div
                key={i}
                className="bg-white border rounded-2xl p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <HelpCircle size={16} />
                  {f.q}
                </div>

                <p className="text-sm text-slate-600 mt-2">{f.a}</p>
              </div>
            ))}
          </div>
        )}

        <footer className="text-center text-xs text-slate-400 mt-10">
          If this is an emergency, call your local emergency number immediately.
        </footer>
      </div>
    </div>
  );
}
