import { useState } from "react";
import { ChevronDown, MapPin, Info, Phone, Clock } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: "map" | "info" | "phone" | "clock";
}

const faqData: FAQItem[] = [
  {
    question: "What are the top tourist spots in Gabaldon, Nueva Ecija?",
    answer:
      "Gabaldon offers stunning natural attractions including the Pantabangan-Carranglan Watershed Forest Reserve, scenic river views along the Pampanga River, lush agricultural landscapes, and traditional Filipino community experiences. The town is known for its eco-tourism potential and peaceful rural charm.",
    icon: "map",
  },
  {
    question: "How do I get to Gabaldon from Manila?",
    answer:
      "Gabaldon is approximately 3-4 hours from Manila by private vehicle. Take NLEX to SCTEX, then proceed to Cabanatuan City via Nueva Ecija. From Cabanatuan, head northeast towards Gabaldon. Public buses and vans also service the route from Manila to Nueva Ecija.",
    icon: "map",
  },
  {
    question: "What is the best time to visit Gabaldon?",
    answer:
      "The best time to visit is during the dry season from November to April. The weather is more pleasant for outdoor activities and exploring the natural attractions. Avoid the typhoon season (July-October) for safer travel.",
    icon: "clock",
  },
  {
    question: "Are there accommodations available in Gabaldon?",
    answer:
      "Gabaldon offers various accommodation options including local inns, homestays, and guesthouses. For more upscale options, nearby Cabanatuan City has hotels and resorts. It's recommended to book in advance, especially during peak season and local festivals.",
    icon: "info",
  },
  {
    question: "What activities can tourists do in Gabaldon?",
    answer:
      "Visitors can enjoy nature trekking, river activities, bird watching, farm tours, cultural immersion with local communities, and sampling authentic Nueva Ecija cuisine. The area is perfect for eco-tourism and those seeking a peaceful retreat from city life.",
    icon: "info",
  },
  {
    question: "Who can I contact for tourism information?",
    answer:
      "Contact the Gabaldon Municipal Tourism Office for the latest information on tourist spots, accommodations, and local events. You can also reach out to the Nueva Ecija Provincial Tourism Office for broader regional tourism information and assistance.",
    icon: "phone",
  },
];

const iconMap = {
  map: MapPin,
  info: Info,
  phone: Phone,
  clock: Clock,
};

export default function TourismFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            ITourgab
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover Gabaldon, Nueva Ecija
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Your guide to exploring natural wonders and local culture
          </p>
        </div>

        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const Icon = iconMap[faq.icon];
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-200 hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isOpen
                          ? "bg-blue-500 shadow-lg shadow-blue-500/30"
                          : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          isOpen ? "text-white" : "text-slate-600"
                        }`}
                      />
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-slate-900 pr-4">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 pt-2">
                    <div className="pl-14">
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-200/60">
            <Info className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-slate-600">
              Have more questions? Contact the local tourism office
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
