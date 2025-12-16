import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroLandscape from "/bg.gif";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "@/api/authApi";
import { fetchCurrentUser, User } from "@/api/userApi";
import { useAuthStore } from "@/store/authStore";

type Props = {
  onLogin: (user: User) => void;
  onClose: () => void;
};

export default function Login({ onLogin, onClose }: Props) {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { identifier: string; password: string }) =>
      loginApi(payload),
    onSuccess: async (data) => {
      setAuth(data.accessToken, data.refreshToken);
      await qc.invalidateQueries(["auth", "me"]);
      try {
        const user = await fetchCurrentUser();
        onLogin(user);
        onClose();
      } catch {
        onClose();
      }
    },
    onError: (e: any) => {
      setError(e?.response?.data?.message ?? e?.message ?? "Login failed");
    },
  });

  useEffect(() => {
    if (mutation.error)
      setError((mutation.error as any)?.message ?? "Login failed");
  }, [mutation.error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    mutation.mutate({
      identifier: formData.identifier,
      password: formData.password,
    });
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
                className=" bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
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
              Sign in to start your adventure
            </motion.p>
          </div>

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
                  placeholder="Username"
                  value={formData.identifier}
                  onChange={(e) => 
                    setFormData((prev) => ({
                      ...prev,
                      identifier: e.target.value,
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
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full btn-hero h-14 rounded-2xl"
            >
              {mutation.isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
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
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← Back to Home
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

        <div className="absolute top-20 right-20 floating-element">
          <div className="glass-morphism rounded-full p-3">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <div
          className="absolute bottom-32 left-20 floating-element"
          style={{ animationDelay: "2s" }}
        >
          <div className="glass-morphism rounded-full p-3">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
