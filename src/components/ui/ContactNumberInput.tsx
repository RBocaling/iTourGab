// src/components/ContactNumberInput.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Smartphone, Phone as PhoneIcon } from "lucide-react";

type Props = {
  value?: string; // e.g. "+639171234567" or ""
  onChange?: (e164: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showErrorMessages?: boolean;
};

const PH_COUNTRY_CODE = "63";

/** Helpers */
function onlyDigits(s: string) {
  return (s || "").replace(/\D+/g, "");
}

function extractNSNFromInput(raw: string): string {
  const d = onlyDigits(raw);
  if (!d) return "";

  // If pasted with country code: 63917..., remove leading 63
  if (d.startsWith(PH_COUNTRY_CODE) && d.length > PH_COUNTRY_CODE.length) {
    return d.slice(PH_COUNTRY_CODE.length);
  }

  // If starts with 0 (09...), remove the leading 0
  if (d.startsWith("0")) {
    return d.slice(1);
  }

  return d;
}

function nsnToE164(nsn: string) {
  if (!nsn) return "";
  return `+${PH_COUNTRY_CODE}${nsn}`;
}

function formatDisplayForUI(nsn: string) {
  if (!nsn) return "";
  if (nsn.length <= 3) return nsn;
  if (nsn.length <= 6) return `${nsn.slice(0, 3)}-${nsn.slice(3)}`;
  if (nsn.length <= 10)
    return `${nsn.slice(0, 3)}-${nsn.slice(3, 6)}-${nsn.slice(6)}`;
  return nsn;
}

function isValidPHNSN(nsn: string) {
  return nsn.length === 10;
}

export default function ContactNumberInput({
  value = "",
  onChange,
  id,
  name,
  placeholder = "9*********",
  required = false,
  disabled = false,
  className = "",
  showErrorMessages = true,
}: Props) {
  const [nsn, setNsn] = useState<string>(() => {
    if (!value) return "";
    const digits = onlyDigits(value);
    if (digits.startsWith(PH_COUNTRY_CODE))
      return digits.slice(PH_COUNTRY_CODE.length);
    return extractNSNFromInput(value);
  });

  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!value) {
      setNsn("");
      return;
    }
    const digits = onlyDigits(value);
    if (digits.startsWith(PH_COUNTRY_CODE))
      setNsn(digits.slice(PH_COUNTRY_CODE.length));
    else setNsn(extractNSNFromInput(value));
  }, [value]);

  const display = useMemo(() => formatDisplayForUI(nsn), [nsn]);
  const e164 = useMemo(() => (nsn ? nsnToE164(nsn) : ""), [nsn]);
  const valid = useMemo(() => isValidPHNSN(nsn), [nsn]);

  useEffect(() => {
    onChange?.(e164);
  }, [e164, onChange]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const candidate = extractNSNFromInput(raw);
    setNsn(candidate);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    const candidate = extractNSNFromInput(text);
    setNsn(candidate);
    e.preventDefault();
  }

  // nice compact border classes
  const outerBorder = disabled
    ? "border-slate-200 bg-gray-50"
    : focused
    ? "ring-2 ring-primary/20 border-primary"
    : valid
    ? "ring-2 ring-emerald-100 border-emerald-300"
    : "border-slate-200";

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        Phone number
      </label>

      <div
        className={`flex items-center gap-1 rounded-2xl border border-input bg-gray-500  px-2 py-2 ${outerBorder} transition-shadow duration-150`}
        style={{ background: "white" }}
      >
        {/* compact country chip */}
        <button
          type="button"
          className="flex items-center gap-2 px-2 py-1 rounded-md bg-transparent border border-transparent text-sm text-muted-foreground hover:bg-slate-100 focus:outline-none"
          aria-label="Select country"
          onClick={() => {
            /* placeholder for country picker - static now */
          }}
        >
          <img src="/ph.jpg" className="w-7 h-6 rounded-full" alt="" />
          <span className="text-xs text-muted-foreground">
            (+{PH_COUNTRY_CODE})
          </span>
        </button>

        {/* input area */}
        <div className="flex-1 min-w-0">
          <input
            id={id}
            name={name}
            inputMode="numeric"
            placeholder={placeholder}
            value={display}
            onChange={handleChange}
            onPaste={handlePaste}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            aria-invalid={required && !valid}
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
            style={{ letterSpacing: "0.3px" }}
          />
        </div>

        {/* right small smartphone icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50 border border-transparent">
          <Smartphone className="w-4 h-4 text-neutral-600" />
        </div>
      </div>

      {/* validation / code row (very small) */}
      <div className="mt-1 flex items-center justify-between text-xs">
        {showErrorMessages && (
          <div>
            {!nsn ? (
              required ? (
                <span className="text-rose-600">Phone required</span>
              ) : null
            ) : valid ? (
              <span className="text-emerald-600">Valid</span>
            ) : (
              <span className="text-rose-600">Invalid</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
