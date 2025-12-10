import React, { useState, useRef, useEffect } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  onChange?: (otp: string) => void;
  className?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  onChange,
  className,
  disabled = false,
  autoFocus = true,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    // reset if length changes
    setOtp(new Array(length).fill(""));
    setActiveIndex(0);
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length, autoFocus]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    const otpString = newOtp.join("");
    onChange?.(otpString);

    if (value && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // If complete (no empty characters)
    if (otpString.length === length && !otpString.includes("")) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (disabled) return;
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        setActiveIndex(index);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        setActiveIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (disabled) return;
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const newOtp = new Array(length).fill("");
    for (let i = 0; i < pasted.length && i < length; i++) newOtp[i] = pasted[i];
    setOtp(newOtp);
    onChange?.(newOtp.join(""));
    const nextIndex = Math.min(pasted.length, length - 1);
    setActiveIndex(nextIndex);
    inputRefs.current[nextIndex]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  };

  const handleFocus = (index: number) => setActiveIndex(index);

  return (
    <div className={cn("flex gap-3 items-center justify-center", className)}>
      {otp.map((digit, idx) => (
        <Input
          key={idx}
          ref={(el: HTMLInputElement | null) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(idx)}
          disabled={disabled}
          className={cn(
            "w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg",
            "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
            activeIndex === idx && "border-blue-500 ring-2 ring-blue-200",
            digit && "border-green-500 bg-green-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
};

export default OtpInput;
