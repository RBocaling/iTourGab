// src/components/ui/FeedbackModals.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

type BaseModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
};

type ActionModalProps = BaseModalProps & {
  primaryLabel?: string;
  onPrimary?: () => void;
};

type ConfirmModalProps = BaseModalProps & {
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
};

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Success",
  description = "Your action was completed successfully.",
  primaryLabel = "Got it",
  onPrimary,
}: ActionModalProps) {
  const handlePrimary = () => {
    onPrimary?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border border-emerald-100 bg-white/90 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-4">
          <Button
            className="w-full rounded-full text-sm bg-green-500 hover:bg-green-600 text-white h-12"
            onClick={handlePrimary}
          >
            {primaryLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Something went wrong",
  description = "Please try again in a moment.",
  primaryLabel = "Close",
  onPrimary,
}: ActionModalProps) {
  const handlePrimary = () => {
    onPrimary?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border border-rose-100 bg-white/90 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center shadow-inner">
                <XCircle className="w-7 h-7 text-rose-500" />
              </div>
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-4">
          <Button
            className="w-full rounded-full text-sm bg-primary hover:bg-primary text-white h-12"
            onClick={handlePrimary}
          >
            {primaryLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "Please confirm to continue.",
  primaryLabel = "Confirm",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
}: ConfirmModalProps) {
  const handlePrimary = () => {
    onPrimary?.();
  };

  const handleSecondary = () => {
    onSecondary?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border border-slate-200 bg-white/90 backdrop-blur-xl rounded-3xl p-0 overflow-hidden">
        <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-3">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                <HelpCircle className="w-7 h-7 text-slate-700" />
              </div>
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-4 flex gap-2">
          <Button
            variant="outline"
            className="w-full rounded-2xl text-sm h-12"
            onClick={handleSecondary}
          >
            {secondaryLabel}
          </Button>
          <Button
            className="w-full rounded-full text-sm bg-primary hover:bg-primary/70 text-white h-12"
            onClick={handlePrimary}
          >
            {primaryLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
