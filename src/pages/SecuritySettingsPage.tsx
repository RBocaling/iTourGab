import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/BackButton";
import { useAuth2 } from "@/hooks/useAuth";
import { resetPasswordApi } from "@/api/authApi";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const MIN_PASSWORD = 6;

const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth2();
  const { toast } = useToast();
  const email = user?.email_address ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const resetMutation = useMutation({
    mutationFn: () =>
      resetPasswordApi({
        email,
        newPassword,
      }),
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      setFieldError(null);
      toast({
        title: "Password updated successfully",
        description:
          "Please log in again if you are signed out on other devices, or if you experience any sign-in issues.",
      });
    },
    onError: (err: unknown) => {
      const anyErr = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        anyErr?.response?.data?.message ??
        anyErr?.message ??
        "Something went wrong.";
      toast({
        variant: "destructive",
        title: "Could not update password",
        description: msg,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError(null);
    if (!newPassword.trim()) {
      setFieldError("New password is required.");
      return;
    }
    if (newPassword.length < MIN_PASSWORD) {
      setFieldError(
        `Password must be at least ${MIN_PASSWORD} characters.`,
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setFieldError("Passwords do not match.");
      return;
    }
    if (!email) {
      setFieldError("No email on file for this account.");
      return;
    }
    resetMutation.mutate();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="max-w-lg mx-auto px-4 py-6 md:py-10 md:mt-4">
        <div className="flex items-center gap-3 mb-6">
          <BackButton />
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-6 h-6 text-primary shrink-0" />
            <h1 className="text-lg md:text-xl font-bold leading-tight">
              Change Password &amp; Security
            </h1>
          </div>
        </div>

        <Card className="p-6 shadow-sm">
          {!email ? (
            <p className="text-sm text-muted-foreground">
              Your account does not have an email address on file. Password
              reset from this screen is not available.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="security-email">Email</Label>
                <Input
                  id="security-email"
                  type="email"
                  readOnly
                  autoComplete="email"
                  value={email}
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  This email is used for your account and cannot be changed
                  here.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="security-new">New password</Label>
                <Input
                  id="security-new"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="security-confirm">Confirm password</Label>
                <Input
                  id="security-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>

              {fieldError && (
                <p className="text-sm text-destructive">{fieldError}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? "Updating…" : "Update password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
