import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  X as XIcon,
  Check,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroLandscape from "@/assets/hero-landscape.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register as registerApi, verifyAccountApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import OtpInput from "../ui/otp-input";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function checkPasswordRules(pw: string) {
  const rules = {
    length: pw.length >= 8,
    firstUpper: /^[A-Z]/.test(pw),
    hasLower: /[a-z]/.test(pw),
    hasDigit: /\d/.test(pw),
    hasSymbol: /[!@#$%^&*()_\-+=[\]{};:'"\\|,.<>/?`~]/.test(pw),
  };
  return rules;
}

export default function Register() {
  const [otpValue, setOtpValue] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpUserEmail, setOtpUserEmail] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    username: "",
    contact_number: "",
    province: "",
    city: "",
    barangay: "",
    profile_url: "",
    gender: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalMessage, setSuccessModalMessage] = useState<string | null>(
    null
  );
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState<string | null>(
    null
  );

  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (payload: any) => registerApi(payload),
    onSuccess: async (res: any) => {
      const response = res?.data ? res : { data: res?.data ?? res };
      const user = response?.data;
      if (response?.accessToken && response?.refreshToken) {
        setAuth(response.accessToken, response.refreshToken);
        await qc.invalidateQueries(["auth", "me"] as any);
        setSuccessModalMessage("Registration successful");
        setSuccessModalOpen(true);
        return;
      }
      if (user?.email_address) {
        setOtpUserEmail(user.email_address);
        setOtpOpen(true);
        setSuccessModalMessage(
          response?.message ?? "Registered. Please verify your account."
        );
        return;
      }
      setSuccessModalMessage(
        response?.message ?? "Registered. Please verify your account."
      );
      setSuccessModalOpen(true);
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Registration failed";
      setError(msg);
      setErrorModalMessage(String(msg));
      setErrorModalOpen(true);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: { email: string; otp: string }) =>
      verifyAccountApi(payload),
    onSuccess: async (res: any) => {
      if (res?.accessToken && res?.refreshToken) {
        setAuth(res.accessToken, res.refreshToken);
        await qc.invalidateQueries(["auth", "me"] as any);
      } else if (res?.token) {
        setAuth(res.token, res.token);
      }
      setOtpOpen(false);
      setOtpValue("");
      setOtpUserEmail(null);
      setOtpError("");
      setSuccessModalMessage(res?.Message ?? "Account verified successfully");
      setSuccessModalOpen(true);
      await qc.invalidateQueries(["auth", "me"] as any);
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "OTP verification failed";
      setOtpError(String(msg));
    },
  });

  useEffect(() => {
    if (registerMutation.error) {
      setError(
        (registerMutation.error as any)?.message ?? "Registration failed"
      );
    }
  }, [registerMutation.error]);

  const emailIsValid = useMemo(
    () => isValidEmail(formData.email_address),
    [formData.email_address]
  );
  const passwordRules = useMemo(
    () => checkPasswordRules(formData.password),
    [formData.password]
  );
  const passwordOk = Object.values(passwordRules).every(Boolean);
  const confirmMatches = formData.password === formData.confirmPassword;

  function validateBeforeSubmit() {
    if (!formData.first_name.trim()) return "First name is required";
    if (!formData.last_name.trim()) return "Last name is required";
    if (!formData.username.trim()) return "Username is required";
    if (!emailIsValid) return "Please enter a valid email";
    if (!passwordOk) return "Password does not meet requirements";
    if (!confirmMatches) return "Passwords do not match";
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const vError = validateBeforeSubmit();
    if (vError) {
      setError(vError);
      return;
    }

    const allowedGenders = ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"];
    let gender = formData.gender
      ? formData.gender.toUpperCase()
      : "UNSPECIFIED";
    if (!allowedGenders.includes(gender)) gender = "UNSPECIFIED";

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email_address: formData.email_address,
      password: formData.password,
      contact_number: formData.contact_number || null,
      profile_url: formData.profile_url || null,
      gender,
      province: formData.province || null,
      city: formData.city || null,
      barangay: formData.barangay || null,
      birthday: formData.birthday
        ? new Date(formData.birthday).toISOString()
        : null,
      role: "CLIENT",
    };

    registerMutation.mutate(payload);
  };

  const handleOtpComplete = (value: string) => {
    setOtpValue(value);
    setOtpError("");
    if (!otpUserEmail) {
      setOtpError("Missing user email for verification");
      return;
    }
    verifyMutation.mutate({ email: otpUserEmail, otp: value });
  };

  const handleManualVerifyClick = () => {
    if (!otpUserEmail) return setOtpError("Missing user email");
    if (!otpValue || otpValue.length === 0) return setOtpError("Enter the OTP");
    setOtpError("");
    verifyMutation.mutate({ email: otpUserEmail, otp: otpValue });
  };

  const handleSuccessOk = () => {
    setSuccessModalOpen(false);
    setSuccessModalMessage(null);
    navigate("/login");
  };

  const handleErrorOk = () => {
    setErrorModalOpen(false);
    setErrorModalMessage(null);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:max-w-md space-y-8 md:bg-white rounded-3xl md:p-5 md:shadow-2xl"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gradient-primary"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <img src="/logo-itour.png" className="w-24" alt="" />
              </motion.div>
              iTourGab
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Create an account to start your adventure
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type="text"
                  placeholder="First name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, first_name: e.target.value }))
                  }
                  className="pl-12 input-modern h-12 bg-white"
                  required
                />
              </div>

              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type="text"
                  placeholder="Last name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, last_name: e.target.value }))
                  }
                  className="pl-12 input-modern h-12 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email_address}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        email_address: e.target.value,
                      }))
                    }
                    className="pl-12 input-modern h-12 bg-white"
                    required
                  />
                  {!emailIsValid && formData.email_address.length > 0 && (
                    <div className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Invalid email address
                    </div>
                  )}
                </div>

                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, username: e.target.value }))
                    }
                    className="pl-12 input-modern h-12 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type="text"
                  placeholder="Contact No"
                  value={formData.contact_number}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      contact_number: e.target.value,
                    }))
                  }
                  className="pl-12 input-modern h-12 bg-white"
                />
              </div>

              {/* Province / City / Barangay inputs (replaces single address field) */}
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                  <Input
                    type="text"
                    placeholder="Province"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, province: e.target.value }))
                    }
                    className="pl-12 input-modern h-12 bg-white"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                  <Input
                    type="text"
                    placeholder="City / Municipality"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, city: e.target.value }))
                    }
                    className="pl-12 input-modern h-12 bg-white"
                  />
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                  <Input
                    type="text"
                    placeholder="Barangay"
                    value={formData.barangay}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, barangay: e.target.value }))
                    }
                    className="pl-12 input-modern h-12 bg-white"
                  />
                </div>
              </div>

              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, gender: e.target.value }))
                  }
                  className="w-full h-12 rounded-md border bg-white pl-3 pr-3"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <Input
                  type="date"
                  placeholder="Birthday"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, birthday: e.target.value }))
                  }
                  className="pl-12 input-modern h-12 bg-white"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, password: e.target.value }))
                  }
                  className="pl-12 pr-12 input-modern h-12 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                <div className="mt-2 text-xs">
                  <div className="flex gap-2 items-center">
                    {passwordRules.length ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span
                      className={
                        passwordRules.length
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {passwordRules.firstUpper ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span
                      className={
                        passwordRules.firstUpper
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      Starts with an uppercase letter
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {passwordRules.hasLower ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span
                      className={
                        passwordRules.hasLower
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      Contains lowercase
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {passwordRules.hasDigit ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span
                      className={
                        passwordRules.hasDigit
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      Contains a digit
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    {passwordRules.hasSymbol ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span
                      className={
                        passwordRules.hasSymbol
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      Contains a symbol (e.g. !@#)
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="pl-12 pr-12 input-modern h-12 bg-white"
                  required
                />
                <div className="mt-2 text-xs">
                  {!confirmMatches && formData.confirmPassword.length > 0 && (
                    <div className="text-rose-600">Passwords do not match</div>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                registerMutation.isPending ||
                !emailIsValid ||
                !passwordOk ||
                !confirmMatches
              }
              className="w-full btn-hero h-14 rounded-2xl"
            >
              {registerMutation.isPending ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Register <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {error && <div className="text-red-400 text-sm">{error}</div>}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <Link to="/login" className="text-muted-foreground text-primary">
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroLandscape})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-secondary/30" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">Welcome to Gabaldon</h2>
            <p className="text-xl opacity-90 mb-8">
              Discover the natural beauty and adventure waiting for you in Nueva
              Ecija
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="glass-morphism rounded-xl p-4">
                <div className="text-2xl font-bold">10+</div>
                <div className="opacity-80">Tourist Spots</div>
              </div>
              <div className="glass-morphism rounded-xl p-4">
                <div className="text-2xl font-bold">1000+</div>
                <div className="opacity-80">Happy Visitors</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* OTP modal, success and error modals unchanged */}
      {otpOpen && (
        <div className="h-screen w-full flex items-center justify-center fixed top-0 left-0 bg-black/30 z-50">
          <div className="flex max-w-sm gap-3 flex-col justify-center h-auto bg-white rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Verify Account</h1>
                <p className="text-sm text-neutral-500">
                  We sent an OTP to your email / phone. Enter it below to verify
                  your account.
                </p>
              </div>
              <button
                onClick={() => setOtpOpen(false)}
                className="text-muted-foreground"
              >
                <XIcon />
              </button>
            </div>

            <OtpInput
              length={6}
              onComplete={handleOtpComplete}
              onChange={(v) => setOtpValue(v)}
              disabled={verifyMutation.isPending}
              className="mt-3"
            />

            {otpError && (
              <div className="text-sm text-rose-600 mt-2">{otpError}</div>
            )}
            {verifyMutation.error && (
              <div className="text-sm text-rose-600 mt-2">
                {(verifyMutation.error as any)?.message ??
                  "Verification failed"}
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                onClick={() => {
                  setOtpOpen(false);
                  setOtpValue("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleManualVerifyClick}
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {successModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Check className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">
                  {successModalMessage ?? "Success"}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Your account is ready. Click OK to proceed to login.
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSuccessOk}>OK</Button>
            </div>
          </div>
        </div>
      )}

      {errorModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <div className="flex items-start gap-3">
              <div className="bg-rose-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-rose-700" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg">Error</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {errorModalMessage ?? "Something went wrong"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={handleErrorOk}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
