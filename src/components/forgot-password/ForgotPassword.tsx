import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OtpInput from "@/components/ui/otp-input";
import {
  forgotPasswordApi,
  verifyForgotPasswordOtpApi,
  resetPasswordApi,
} from "@/api/authApi";
import { useMutation } from "@tanstack/react-query";

type Props = {
  open: boolean;
  onClose: () => void;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkPasswordRules(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    digit: /\d/.test(pw),
  };
}

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [step, setStep] = useState<"EMAIL" | "OTP" | "RESET">("EMAIL");

  const [email, setEmail] = useState("");
  const [lockedEmail, setLockedEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("EMAIL");
      setEmail("");
      setLockedEmail("");
      setOtp("");
      setPassword("");
      setConfirm("");
      setError("");
      setShowPassword(false);
    }
  }, [open]);

  const rules = useMemo(() => checkPasswordRules(password), [password]);
  const passwordOk = Object.values(rules).every(Boolean);
  const confirmOk = password === confirm;

  const sendOtp = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      setLockedEmail(email);
      setError("");
      setStep("OTP");
    },
    onError: (e: any) =>
      setError(e?.response?.data?.message ?? "Email not found"),
  });

  const verifyOtp = useMutation({
    mutationFn: verifyForgotPasswordOtpApi,
    onSuccess: () => {
      setError("");
      setStep("RESET");
    },
    onError: (e: any) =>
      setError(e?.response?.data?.message ?? "Invalid or expired OTP"),
  });

  const resetPassword = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => onClose(),
    onError: (e: any) =>
      setError(e?.response?.data?.message ?? "Failed to reset password"),
  });

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Forgot Password</h2>
              <p className="text-sm text-muted-foreground">
                Recover your account access
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* EMAIL STEP */}
          {step === "EMAIL" && (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="pl-12 h-12 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                className="w-full h-12 rounded-xl"
                disabled={!isValidEmail(email) || sendOtp.isPending}
                onClick={() => {
                  setError("");
                  sendOtp.mutate({ email });
                }}
              >
                {sendOtp.isPending ? "Sending OTP…" : "Send OTP"}
              </Button>
            </>
          )}

          {/* OTP STEP */}
          {step === "OTP" && (
            <>
              <OtpInput length={6} value={otp } onChange={setOtp} />

              <Button
                className="w-full h-12 rounded-xl"
                disabled={otp.length !== 6 || verifyOtp.isPending}
                onClick={() => {
                  setError("");
                  verifyOtp.mutate({
                    email: lockedEmail,
                    otp,
                  });
                }}
              >
                {verifyOtp.isPending ? "Verifying…" : "Verify OTP"}
              </Button>

              <button
                onClick={() => {
                  setError("");
                  setOtp("");
                  setStep("EMAIL");
                }}
                className="text-xs text-muted-foreground hover:text-primary text-center"
              >
                Wrong email?
              </button>
            </>
          )}

          {/* RESET STEP */}
          {step === "RESET" && (
            <>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border outline-none focus:ring-2 focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <Input
                type="password"
                placeholder="Confirm password"
                className="h-12 rounded-xl"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />

              <Button
                className="w-full h-12 rounded-xl"
                disabled={!passwordOk || !confirmOk || resetPassword.isPending}
                onClick={() =>
                  resetPassword.mutate({
                    email: lockedEmail,
                    newPassword: password,
                  })
                }
              >
                {resetPassword.isPending ? "Resetting…" : "Reset Password"}
              </Button>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
