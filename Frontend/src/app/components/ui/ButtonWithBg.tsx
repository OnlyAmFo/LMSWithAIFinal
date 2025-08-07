"use client";

import { ReactNode } from "react";
interface ButtonProps {
  children: ReactNode;
  background?: string | undefined;
}

const ButtonWithBg = ({ children, background }: ButtonProps) => {
  return (
    <button
      className="bg-orange-500 text-white rounded-lg px-5 py-2"
      style={background ? { background } :undefined}
    >
      {children}
    </button>
  );
};

export default ButtonWithBg;
