import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Settings,
  Heart,
  Calendar,
  MapPin,
  Camera,
  Edit3,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Star,
  ChevronRight,
  Mail,
  Phone,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth2 } from "@/hooks/useAuth";
import { useGetItineraries } from "@/hooks/useGeiTinerary";
import { useProfileTotal } from "@/hooks/useProfileTotal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { updateCurrentUserApi } from "@/api/userApi";
import {
  ConfirmDialog,
  ErrorDialog,
  SuccessDialog,
} from "@/components/alert/FeedbackModals";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth2();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(
    user?.preferences?.notifications ?? true
  );
  const { data: itinerary, isLoading: isIteneraryLoading } =
    useGetItineraries();
  const { myReview, myVisited, isLoading } = useProfileTotal();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    contact_number: "",
    province: "",
    city: "",
    barangay: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const [successState, setSuccessState] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [errorState, setErrorState] = useState({
    open: false,
    title: "",
    message: "",
  });

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateCurrentUserApi(payload),
    onSuccess: () => {
      setSuccessState({
        open: true,
        title: "Profile updated",
        message: "Your profile was updated successfully.",
      });
      setIsEditOpen(false);
      setConfirmEditOpen(false);
      setTimeout(() => window.location.reload(), 600);
    },
    onError: (err: any) => {
      setErrorState({
        open: true,
        title: "Update failed",
        message: err?.message ?? "Unable to update profile.",
      });
      setConfirmEditOpen(false);
    },
  });

  const uploadAndUpdateMutation = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const url = await uploadImageToCloudinary(file);
      return updateCurrentUserApi({ profile_url: url });
    },
    onSuccess: () => {
      setIsUploadOpen(false);
      setConfirmUploadOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSuccessState({
        open: true,
        title: "Profile picture updated",
        message: "Your profile picture was updated.",
      });
    },
    onError: (err: any) => {
      setErrorState({
        open: true,
        title: "Upload failed",
        message: err?.message ?? "Unable to upload profile picture.",
      });
      setConfirmUploadOpen(false);
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const stats = [
    {
      label: "Places Visited",
      value: isLoading ? "Loading" : myVisited?.length,
      icon: MapPin,
    },
    {
      label: "Reviews Written",
      value: isLoading ? "Loading" : myReview?.length,
      icon: Star,
    },
    {
      label: "Trips Planned",
      value: isIteneraryLoading ? "Loading" : itinerary?.length,
      icon: Calendar,
    },
  ];

  const menuItems = [
    {
      icon: Heart,
      label: "My Favorites",
      description: "Saved destinations",
      action: () => navigate("/favorites"),
      color: "text-red-500",
    },
    {
      icon: Calendar,
      label: "My Itineraries",
      description: "Planned trips",
      action: () => navigate("/itinerary"),
      color: "text-blue-500",
    },
    {
      icon: Award,
      label: "My Bookings",
      description: "Reservation history",
      action: () => {},
      color: "text-green-500",
    },
    {
      icon: Camera,
      label: "Photo Gallery",
      description: "My travel photos",
      action: () => {},
      color: "text-purple-500",
    },
  ];

  const settingsItems = [
    {
      icon: Bell,
      label: "Notifications",
      description: "Push notifications",
      action: () => setNotifications((v) => !v),
      hasToggle: true,
      toggleValue: notifications,
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      description: "Account security",
      action: () => {},
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      description: "Get assistance",
      action: () => {},
    },
    {
      icon: Settings,
      label: "App Settings",
      description: "Preferences",
      action: () => {},
    },
  ];

  const handleEditChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.FormEvent<HTMLInputElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const openEditModal = () => {
    setEditForm({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      username: user?.username ?? "",
      contact_number: user?.contact_number ?? user?.profile?.phone ?? "",
      province: user?.province ?? "",
      city: user?.city ?? "",
      barangay: user?.barangay ?? "",
    });
    setIsEditOpen(true);
  };

  const submitEdit = () => {
    setConfirmEditOpen(true);
  };

  const confirmEdit = () => {
    const payload: any = {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      username: editForm.username,
      contact_number: editForm.contact_number,
      province: editForm.province,
      city: editForm.city,
      barangay: editForm.barangay,
    };
    updateMutation.mutate(payload);
  };

  const openUploadModal = () => {
    setIsUploadOpen(true);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const submitUpload = () => {
    if (!selectedFile) {
      setErrorState({
        open: true,
        title: "No file",
        message: "Please select an image first.",
      });
      return;
    }
    setConfirmUploadOpen(true);
  };

  const confirmUpload = () => {
    if (!selectedFile) return;
    uploadAndUpdateMutation.mutate({ file: selectedFile });
  };

  return (
    <div className="min-h-screen bg-background pt-5 md:pt-24 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <Avatar className="w-28 h-28 border-4 border-primary">
              <AvatarImage
                src={
                  user?.profile_url ??
                  user?.profile?.avatar ??
                  user?.profile?.avatarUrl
                }
                alt={user?.name}
              />
              <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={openUploadModal}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 capitalize">
            {user?.name}
          </h1>
          <p className="text-muted-foreground mb-2">
            {user?.email_address ?? user?.profile?.email}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge className="capitalize bg-gradient-primary text-white">
              Client
            </Badge>
            <Badge variant="outline">
              <MapPin className="w-3 h-3 mr-1" />
              {`${user?.province ?? ""}, ${user?.city ?? ""}, ${
                user?.barangay ?? ""
              }`}
            </Badge>
          </div>

          {user?.profile?.bio && (
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              {user.profile.bio}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 text-center glass-card">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {user?.email_address ?? user?.profile?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>
              {user?.contact_number && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{user.contact_number}</p>
                    <p className="text-sm text-muted-foreground">
                      Phone Number
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="outline" onClick={openEditModal}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {menuItems.map((item, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                onClick={item.action}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-muted group-hover:scale-110 transition-transform ${item.color}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" /> Settings &amp;
              Preferences
            </h2>
            <div className="space-y-1">
              {settingsItems.map((item, index) => (
                <div key={index}>
                  <div
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 cursor-pointer group"
                    onClick={item.action}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {index < settingsItems.length - 1 && (
                    <Separator className="my-1" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-destructive border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg w-full rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="first_name"
                value={editForm.first_name ?? ""}
                onChange={handleEditChange}
                onInput={handleEditChange}
                placeholder="First name"
                autoComplete="given-name"
              />
              <Input
                name="last_name"
                value={editForm.last_name ?? ""}
                onChange={handleEditChange}
                onInput={handleEditChange}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>

            <Input
              name="username"
              value={editForm.username ?? ""}
              onChange={handleEditChange}
              onInput={handleEditChange}
              placeholder="Username"
              autoComplete="username"
            />

            <Input
              name="contact_number"
              value={editForm.contact_number ?? ""}
              onChange={handleEditChange}
              onInput={handleEditChange}
              placeholder="Contact number"
              inputMode="tel"
            />

            <div className="grid grid-cols-3 gap-2">
              <Input
                name="province"
                value={editForm.province ?? ""}
                onChange={handleEditChange}
                onInput={handleEditChange}
                placeholder="Province"
              />
              <Input
                name="city"
                value={editForm.city ?? ""}
                onChange={handleEditChange}
                onInput={handleEditChange}
                placeholder="City"
              />
              <Input
                name="barangay"
                value={editForm.barangay ?? ""}
                onChange={handleEditChange}
                onInput={handleEditChange}
                placeholder="Barangay"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitEdit} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isUploadOpen}
        onOpenChange={(open) => {
          setIsUploadOpen(open);
          if (!open) {
            setSelectedFile(null);
            setPreviewUrl(null);
          }
        }}
      >
        <DialogContent className="max-w-md w-full rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Upload Profile Picture
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-50 border flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : user?.profile_url || user?.profile?.avatar ? (
                    <img
                      src={user?.profile_url ?? user?.profile?.avatar}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-medium text-white bg-gradient-primary">
                      {user?.name?.charAt(0) ?? "U"}
                    </div>
                  )}
                </div>

                <div className="absolute -right-1 -bottom-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="w-8 h-8 rounded-full bg-white border shadow-sm flex items-center justify-center text-sm text-slate-700 hover:scale-105 transition-transform"
                    title="Remove selected"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full">
                <label className="group flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-primary transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-sm">
                        Select or drop an image
                      </div>
                      <div className="text-xs text-muted-foreground">
                        PNG, JPG or GIF — square image recommended
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setSelectedFile(f);
                      if (f) {
                        const u = URL.createObjectURL(f);
                        setPreviewUrl(u);
                      } else {
                        setPreviewUrl(null);
                      }
                    }}
                  />
                </label>

                {selectedFile && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="text-sm text-muted-foreground truncate">
                      {selectedFile.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={submitUpload}
                        disabled={uploadAndUpdateMutation.isPending}
                      >
                        {uploadAndUpdateMutation.isPending
                          ? "Uploading..."
                          : "Upload"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!selectedFile && (
              <div className="text-xs text-muted-foreground">
                Tip: use a square photo for avatars. You can crop after
                uploading if needed.
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
              >
                Cancel
              </Button>
              {!selectedFile && (
                <Button
                  onClick={() => {
                    /* no-op until file selected */
                  }}
                  disabled
                >
                  Upload
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmEditOpen}
        onOpenChange={setConfirmEditOpen}
        title="Save changes?"
        description="Are you sure you want to save these profile changes?"
        primaryLabel={updateMutation.isPending ? "Saving..." : "Save"}
        secondaryLabel="Cancel"
        onPrimary={confirmEdit}
        onSecondary={() => setConfirmEditOpen(false)}
      />

      <ConfirmDialog
        open={confirmUploadOpen}
        onOpenChange={setConfirmUploadOpen}
        title="Upload picture?"
        description="Confirm upload and replace your current profile picture."
        primaryLabel={
          uploadAndUpdateMutation.isPending ? "Uploading..." : "Upload"
        }
        secondaryLabel="Cancel"
        onPrimary={confirmUpload}
        onSecondary={() => setConfirmUploadOpen(false)}
      />

      <SuccessDialog
        open={successState.open}
        onOpenChange={(open) => setSuccessState((s) => ({ ...s, open }))}
        title={successState.title}
        description={successState.message}
        primaryLabel="OK"
      />

      <ErrorDialog
        open={errorState.open}
        onOpenChange={(open) => setErrorState((s) => ({ ...s, open }))}
        title={errorState.title}
        description={errorState.message}
        primaryLabel="OK"
      />
    </div>
  );
};

export default ProfilePage;
