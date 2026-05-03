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
    <div className="min-h-[100dvh] bg-background md:grid md:min-h-screen md:grid-cols-2">
      <Helmet>
        <title>Login – iTourGab | Start Exploring Gabaldon</title>
        <meta
          name="description"
          content="Sign in to iTourGab and explore tourist spots, save destinations, and plan your Gabaldon adventure."
        />
        <link rel="canonical" href="https://itourgab-v1.site/app/login" />
      </Helmet>

      <div className="flex min-h-[100dvh] md:min-h-screen w-full items-center justify-center px-4 py-10 md:px-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md md:max-w-lg lg:max-w-xl space-y-6 rounded-3xl border border-border/50 bg-card p-6 shadow-xl md:p-8"
        >
          <div className="text-center space-y-2">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gradient-primary"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 md:h-[4.5rem] md:w-[4.5rem]"
              >
                <img
                  src="/logo-itour.png"
                  className="w-11 md:w-12"
                  alt="iTourGab"
                />
              </motion.div>
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">
                iTourGab
              </h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground"
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                  className="input-modern h-12 bg-background pl-11 pr-3"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
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
                  className="input-modern h-12 bg-background pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 shrink-0" />
                  ) : (
                    <Eye className="h-5 w-5 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setOpenForgot(true)}
                className="text-xs font-medium text-primary transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="btn-hero h-12 w-full rounded-xl text-base transition-all hover:opacity-[0.96] active:scale-[0.99]"
            >
              {loginMutation.isPending ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px max-w-[6rem] flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                or
              </span>
              <div className="h-px max-w-[6rem] flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => {
                setGoogleError(null);
                googleLogin();
              }}
              disabled={googleMutation.isPending}
              className={`flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-input bg-background px-4 text-sm font-medium transition-all hover:border-primary/30 hover:bg-muted/50 ${
                googleMutation.isPending
                  ? "cursor-not-allowed opacity-60"
                  : ""
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
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
            transition={{ delay: 0.55 }}
            className="flex flex-wrap items-center justify-center gap-x-1 text-center text-sm text-muted-foreground"
          >
            <span>Don&apos;t have an account?</span>
            <Link
              to="/app/register"
              className="font-semibold text-primary transition-colors hover:underline"
            >
              Register
            </Link>
          </motion.div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">About iTourGab: </strong>
            iTourGab is a tourism and travel platform designed to help visitors
            explore tourist spots, natural attractions, and destinations in
            Gabaldon, Nueva Ecija, Philippines.
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative hidden min-h-[220px] md:block md:min-h-screen"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroLandscape})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent md:bg-gradient-to-r md:from-background/40 md:via-transparent md:to-transparent" />
        <div className="relative flex h-full min-h-[220px] flex-col justify-end p-8 md:min-h-screen md:justify-center md:p-10 lg:p-12">
          <div className="max-w-md text-white drop-shadow-md md:text-foreground md:drop-shadow-none">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 md:text-primary">
              Gabaldon, Nueva Ecija
            </p>
            <h2 className="mt-2 text-2xl font-bold leading-tight text-white md:text-3xl md:text-foreground">
              Discover places, plan trips, and explore with confidence.
            </h2>
            <p className="mt-3 text-sm text-white/90 md:text-muted-foreground">
              Your gateway to tourist spots, itineraries, and local experiences.
            </p>
          </div>
        </div>
      </motion.div>

      <ForgotPasswordModal
        open={openForgot}
        onClose={() => setOpenForgot(false)}
      />
    </div>
  );
}
