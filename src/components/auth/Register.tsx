import { useEffect, useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroLandscape from "@/assets/hero-landscape.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register as registerApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email_address: "",
    username: "",
    contact_number: "",
    address: "",
    profile_url: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: any) => registerApi(payload),
    onSuccess: async (data: any) => {
      if (data?.accessToken && data?.refreshToken) {
        setAuth(data.accessToken, data.refreshToken);
      } else if (data?.token) {
        setAuth(data.token, data.token);
      }
      await qc.invalidateQueries(["auth", "me"] as any);
      navigate("/login");
    },
    onError: (e: any) => {
      console.error("Register error:", e?.response?.data);
      setError(
        e?.response?.data?.message ??
          e?.response?.data ??
          e?.message ??
          "Registration failed"
      );
    },
  });

  useEffect(() => {
    if (mutation.error)
      setError((mutation.error as any)?.message ?? "Registration failed");
  }, [mutation.error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password and Confirm Password do not match");
      return;
    }

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email_address ||
      !formData.username ||
      !formData.password
    ) {
      setError("Please fill required fields");
      return;
    }

    // --- FIX: Normalize gender so it matches Prisma Enum EXACTLY ---
    const allowedGenders = ["MALE", "FEMALE", "OTHER", "UNSPECIFIED"];
    let gender = formData.gender
      ? formData.gender.toUpperCase()
      : "UNSPECIFIED";
    if (!allowedGenders.includes(gender)) {
      gender = "UNSPECIFIED";
    }

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email_address: formData.email_address,
      password: formData.password,
      contact_number: formData.contact_number || null,
      profile_url: formData.profile_url || null,
      gender,
      address: formData.address || null,
      role: "CLIENT",
    };

    console.log("Register payload:", payload);
    mutation.mutate(payload);
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

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 w-5 h-5 z-20" />
                <Input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  className="pl-12 input-modern h-12 bg-white"
                />
              </div>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Profile URL (optional)"
                  value={formData.profile_url}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, profile_url: e.target.value }))
                  }
                  className="pl-4 input-modern h-12 bg-white"
                />
              </div>

              {/* FIXED GENDER ENUM VALUES */}
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, gender: e.target.value }))
                  }
                  className="w-full h-12 rounded-md border bg-white pl-3 pr-3"
                >
                  <option value="">Select gender (optional)</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="UNSPECIFIED">Prefer not to say</option>
                </select>
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
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full btn-hero h-14 rounded-2xl"
            >
              {mutation.isPending ? (
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
    </div>
  );
}
