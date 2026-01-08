import { useState } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  ArrowRight,
  X as XIcon,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroLandscape from "/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  login as loginApi,
  googleLogin as googleLoginApi,
} from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { useGoogleLogin } from "@react-oauth/google";
import ForgotPasswordModal from "../forgot-password/ForgotPassword";
import { Helmet } from "react-helmet-async";


export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email_address: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [openForgot, setOpenForgot] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (payload: { email_address: string; password: string }) =>
      loginApi(payload),
    onSuccess: async (data: any) => {
      setErrorMessage(null);
      const access =
        data?.accessToken ?? data?.token ?? data?.tokens?.accessToken;
      const refresh = data?.refreshToken ?? data?.tokens?.refreshToken;
      setAuth(access, refresh);
      await qc.invalidateQueries({ queryKey: ["user"] });
      navigate("/app");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "We couldn't sign you in. Please check your email and password.";
      // user-friendly short headline + friendly hint
      setErrorMessage(String(msg));
    },
  });

  const googleMutation = useMutation({
    mutationFn: (payload: { token: string }) => googleLoginApi(payload),
    onSuccess: async (data: any) => {
      setGoogleError(null);
      const access =
        data?.accessToken ?? data?.token ?? data?.tokens?.accessToken;
      const refresh = data?.refreshToken ?? data?.tokens?.refreshToken;
      setAuth(access, refresh);
      await qc.invalidateQueries({ queryKey: ["user"] });
      navigate("/app");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        err?.message ??
        "Google sign-in failed. Try again or use email/password.";
      setGoogleError(String(msg));
    },
  });

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleError(null);
      const token =
        (tokenResponse as any)?.access_token ??
        (tokenResponse as any)?.credential ??
        (tokenResponse as any)?.code;
      if (token) {
        googleMutation.mutate({ token });
      } else {
        googleMutation.mutate({ token: JSON.stringify(tokenResponse) });
      }
    },
    onError: (err) => {
      const msg =
        (err as any)?.error_description ??
        (err as any)?.message ??
        "Google sign-in failed.";
      setGoogleError(String(msg));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({
      email_address: formData.email_address,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen  bg-background grid grid-cols-1 md:grid-cols-2 gap-9">
      <Helmet>
        <title>
          iTourGab – Explore Tourist Spots in Gabaldon | Get Started
        </title>

        <meta
          name="description"
          content="Get started with iTourGab. Sign in to explore tourist spots in Gabaldon, Nueva Ecija, save destinations, and plan your travel experience."
        />

        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://itourgab-v1.site/" />
      </Helmet>

      <div className="w-full  flex items-center justify-center p-8">
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
                className="bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 w-20 h-20"
              >
                <img src="/logo-itour.png" className="w-14" alt="logo" />
              </motion.div>
              iTourGab
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground"
            >
              Sign in to start your adventure
            </motion.p>
          </div>

          {/* FRIENDLY ERROR (iOS-style) */}
          {errorMessage && (
            <div className="relative rounded-2xl bg-rose-50 ring-1 ring-rose-100 shadow-sm p-3 flex items-start gap-3">
              <div className="flex-none bg-rose-100 rounded-full p-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-rose-700">Whoops!</div>
                <div className="text-sm text-rose-600">{errorMessage}</div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                aria-label="Dismiss error"
                className="flex-none p-2 rounded-full hover:bg-rose-100 ml-2"
              >
                <XIcon className="w-4 h-4 text-rose-600" />
              </button>
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type="text"
                  placeholder="Email"
                  value={formData.email_address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email_address: e.target.value,
                    }))
                  }
                  className="pl-12 input-modern h-14 bg-white"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="pl-12 pr-12 input-modern h-12 bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setOpenForgot(true)}
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full btn-hero h-14 rounded-2xl"
            >
              {loginMutation.isPending ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="flex items-center gap-3 justify-center">
              <div className="h-[1px] bg-neutral-300 w-24" />
              <div className="text-sm text-neutral-400">or</div>
              <div className="h-[1px] bg-neutral-300 w-24" />
            </div>

            {/* GOOGLE BUTTON */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setGoogleError(null);
                  googleLogin();
                }}
                disabled={googleMutation.isPending}
                className={`flex items-center justify-center h-14 w-full gap-3 px-4 py-3 rounded-2xl border ${
                  googleMutation.isPending
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:shadow"
                }`}
                aria-label="Sign in with Google"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 533.5 544.3"
                  className="w-5 h-5"
                  aria-hidden
                >
                  <path
                    fill="#4285f4"
                    d="M533.5 278.4c0-17.7-1.6-35.1-4.6-51.9H272v98.3h147.1c-6.4 34.7-25.7 64.2-54.9 84v69h88.6c51.8-47.7 81.7-118 81.7-199.4z"
                  />
                  <path
                    fill="#34a853"
                    d="M272 544.3c73.6 0 135.4-24.3 180.6-66.2l-88.6-69c-24.6 16.6-56 26.4-92 26.4-70.8 0-130.7-47.8-152.2-112.1H31.2v70.6C76.2 479 167.7 544.3 272 544.3z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M119.8 325.3c-10.8-32.9-10.8-68.3 0-101.2V153.5H31.2c-39.7 78.6-39.7 171.9 0 250.5l88.6-69z"
                  />
                  <path
                    fill="#ea4335"
                    d="M272 107.7c39.9 0 75.8 13.7 104 40.6l78-78C404.1 24.3 342.3 0 272 0 167.7 0 76.2 65.3 31.2 153.5l88.6 70.6C141.3 155.5 201.2 107.7 272 107.7z"
                  />
                </svg>

                <span className="text-sm font-medium">
                  {googleMutation.isPending
                    ? "Signing in..."
                    : "Continue with Google"}
                </span>

                {googleMutation.isPending && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* GOOGLE ERROR (iOS-style small) */}
            {googleError && (
              <div className="relative mt-3 rounded-2xl bg-rose-50 ring-1 ring-rose-100 shadow-sm p-3 flex items-start gap-3">
                <div className="flex-none bg-rose-100 rounded-full p-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-rose-700">
                    Google sign-in
                  </div>
                  <div className="text-sm text-rose-600">{googleError}</div>
                </div>
                <button
                  onClick={() => setGoogleError(null)}
                  aria-label="Dismiss google error"
                  className="flex-none p-2 rounded-full hover:bg-rose-100 ml-2"
                >
                  <XIcon className="w-4 h-4 text-rose-600" />
                </button>
              </div>
            )}

            {googleMutation.isError && !googleError && (
              <div className="text-red-400 text-sm mt-2 text-center">
                Google login failed
              </div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center flex items-center justify-center mb-5"
          >
            Do you have an account?
            <Link
              to="/register"
              className="text-muted-foreground text-primary ml-2"
            >
              Register
            </Link>
          </motion.div>
          <div className="mt-6 rounded-2xl p-3 border border-primary/50 bg-primary/10 text-xs text-muted-foreground text-center max-w-sm mx-auto leading-relaxed">
            <strong>About iTourGab: </strong>
            iTourGab is a tourism and travel platform designed to help visitors
            explore tourist spots, natural attractions, and destinations in
            Gabaldon, Nueva Ecija, Philippines.
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:block w-full h-screen bg-red-500 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: `url(${heroLandscape})` }}
        />
      </motion.div>

      <ForgotPasswordModal
        open={openForgot}
        onClose={() => setOpenForgot(false)}
      />
    </div>
  );
}
