import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth2 } from "@/hooks/useAuth";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  reason?: string | null;
}

export default function SuspendedAccountModal({ open, setOpen, reason }: Props) {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth2();

  const isClient = user?.role === "CLIENT";

  return (
    <Dialog
      open={isAuthenticated && isClient && open}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-md w-full rounded-3xl p-0 overflow-hidden">
        <div className="bg-red-500 text-white p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <DialogTitle className="text-xl font-bold">Account Suspended</DialogTitle>

          <p className="text-sm mt-2 opacity-90">
            Your account has been suspended by the administrator.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <ul className="text-sm space-y-2 text-gray-600 list-disc pl-5">
            <li>Some app features may be limited while your account is suspended.</li>
            <li>You may contact support to appeal or resolve this issue.</li>
          </ul>

          {reason ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <div className="font-semibold mb-1">Suspension Reason</div>
              {reason}
            </div>
          ) : null}

          <Button
            type="button"
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
            onClick={() => {
              setOpen(false);
              navigate("/app/chat-support");
            }}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>

          <Button
            variant="ghost"
            className="w-full text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={() => void logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
