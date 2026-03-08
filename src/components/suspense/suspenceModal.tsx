import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useSuspend, useUnsuspend } from "@/hooks/useSuspense";

type Props = {
  open: boolean;
  onClose: () => void;
  entityType: "TOURIST_SPOT" | "SERVICE" | "USER";
  entityId: number;
  suspended?: boolean;
};

export default function SuspensionModal({
  open,
  onClose,
  entityType,
  entityId,
  suspended,
}: Props) {
  const [reason, setReason] = useState("");

  const suspend = useSuspend();
  const unsuspend = useUnsuspend();

  if (!open) return null;

  const handleSubmit = () => {
    if (suspended) {
      unsuspend.mutate({
        entity_type: entityType,
        entity_id: entityId,
        lifted_reason: reason,
      });
    } else {
      suspend.mutate({
        entity_type: entityType,
        entity_id: entityId,
        suspended_reason: reason,
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="bg-white w-[420px] rounded-3xl shadow-2xl p-6 space-y-5"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="text-red-500" />
              {suspended ? "Lift Suspension" : "Suspend Entity"}
            </h2>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            placeholder={
              suspended
                ? "Reason for unsuspending..."
                : "Reason for suspension..."
            }
            className="w-full border rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-xl text-white font-medium transition
              ${
                suspended
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
          >
            {suspended ? "Unsuspend" : "Suspend"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
