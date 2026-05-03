import { useState } from "react";
import { Search, AlertTriangle, HelpCircle } from "lucide-react";
import EmergencyHotlineCards from "@/components/emergency/EmergencyHotlineCards";
import {
  defaultEmergencyHotlines,
  type EmergencyHotline,
} from "@/data/emergencyHotlines";

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

type HotlinesProps = {
  hotlines?: EmergencyHotline[];
};

export default function Hotlines({
  hotlines = defaultEmergencyHotlines,
}: HotlinesProps) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"contacts" | "safety" | "faq">("contacts");

  const filtered = hotlines.filter((h) => {
    const term = q.toLowerCase();
    return (
      h.name.toLowerCase().includes(term) ||
      h.phone.includes(term) ||
      h.description.toLowerCase().includes(term)
    );
  });

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
            type="button"
            onClick={() => setTab("contacts")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "contacts" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Emergency Contacts
          </button>

          <button
            type="button"
            onClick={() => setTab("safety")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "safety" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Safety & Preparedness
          </button>

          <button
            type="button"
            onClick={() => setTab("faq")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "faq" ? "bg-primary text-white" : "bg-white border"
            }`}
          >
            Emergency FAQ
          </button>
        </div>

        {/* CONTACTS TAB */}
        {tab === "contacts" && <EmergencyHotlineCards hotlines={filtered} />}

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
