import React, { ReactNode, useState } from "react";

interface HoverTooltipProps {
  message: string;
  children: ReactNode;
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({ message, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex z-[999999] w-full"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div className="absolute  top-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black text-white text-xs px-3 py-1 shadow-lg z-50">
          {message}
        </div>
      )}
    </div>
  );
};

export default HoverTooltip;
