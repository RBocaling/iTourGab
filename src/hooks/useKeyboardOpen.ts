import { useEffect, useState } from "react";

export function useKeyboardOpen() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      const vh = window.visualViewport?.height || window.innerHeight;
      const screenH = window.screen.height;
      setIsOpen(vh < screenH * 0.75);
    };

    window.visualViewport?.addEventListener("resize", onResize);
    window.addEventListener("resize", onResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return isOpen;
}
