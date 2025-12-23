import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      onClick={() => navigate(-1)}
      className="flex items-center justify-center border hover:text-white gap-2 rounded-full h-10 w-10 ruf"
    >
      <ArrowLeft size={24} className="text-neutral-500" />
      {/* <span className="text-sm font-medium">{label}</span> */}
    </Button>
  );
}
