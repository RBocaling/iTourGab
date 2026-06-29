import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/ui/BackButton";

interface SuspendedSpotNoticeProps {
  name?: string;
  reason?: string | null;
  onBack?: () => void;
}

export default function SuspendedSpotNotice({
  name,
  reason,
  onBack,
}: SuspendedSpotNoticeProps) {
  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20 md:pb-8 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Destination Unavailable</h2>
          {name ? (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{name}</span> is
              temporarily unavailable.
            </p>
          ) : (
            <p className="text-muted-foreground">
              This destination is temporarily unavailable.
            </p>
          )}
        </div>

        {reason ? (
          <div className="text-left bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
            <div className="font-semibold mb-1">Reason</div>
            <p>{reason}</p>
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground">
          Please check back later or explore other destinations in iTourGab.
        </p>

        {onBack ? (
          <div className="flex justify-center gap-3 pt-2">
            <BackButton />
            <Button variant="outline" onClick={onBack}>
              Go Back
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
