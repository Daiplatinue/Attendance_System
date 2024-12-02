import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Button10() {
  return (
    <Button className="group w-40 mt-7 bg-white text-zinc hover:bg-gray-100 hover:text-white-700">
      OTP
      <ArrowRight
        className="-me-1 ms-2 opacity-60 transition-transform group-hover:translate-x-0.5"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}