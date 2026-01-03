import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { useRef } from "react";

const STATIC_USER_NAME = "Juan Dela Cruz";

type Props = {
  open: boolean;
  booking: any;
  onClose: () => void;
};

export default function BookingReceiptModal({ open, booking, onClose }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!booking) return null;

  const qrPayload = JSON.stringify({
    bookingId: booking.id,
    status: booking.status,
    spotName: booking.spotName,
    service: booking.serviceName,
    availability: booking.availability?.name,
    amount: booking.total,
    user: STATIC_USER_NAME,
  });

  const handlePrint = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Booking Receipt</title>
          <style>
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background: white;
            }
            img {
              width: 100%;
              max-width: 420px;
            }
          </style>
        </head>
        <body>
          <img src="${imgData}" />
          <script>
            window.onload = () => {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 🔒 THIS IS THE PRINTED CONTENT */}
            <div
              ref={receiptRef}
              className="rounded-[28px] bg-white shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="relative px-6 pt-6 pb-4 text-center">
                <h2 className="text-lg font-semibold tracking-tight">
                  Booking Pass
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Scan for verification
                </p>
              </div>

              {/* QR */}
              <div className="flex flex-col items-center px-6">
                <div className="bg-white p-4 rounded-2xl border">
                  <QRCode value={qrPayload} size={180} />
                </div>

                <div className="mt-5 text-center">
                  <p className="text-[11px] uppercase tracking-widest text-neutral-400">
                    Booking ID
                  </p>
                  <p className="text-xl font-semibold tracking-wide mt-1">
                    #{booking.id}
                  </p>
                </div>
              </div>

              {/* Footer note */}
              <div className="mt-6 px-6 pb-6">
                <div className="rounded-xl bg-neutral-100 px-4 py-3 text-center">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Valid only after approval.
                    <br />
                    Status is verified upon scan.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions (NOT printed) */}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-full"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                size="sm"
                className="flex-1 rounded-full bg-black text-white hover:bg-black/90"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white"
            >
              <X className="w-4 h-4 text-black/70" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
