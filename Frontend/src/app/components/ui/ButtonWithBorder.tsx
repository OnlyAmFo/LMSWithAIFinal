"use client";

import { ReactNode } from "react";
interface ButtonProps {
  children: ReactNode;
  borderColor?: string | undefined;
}

const ButtonWithBorder = ({ children, borderColor }: ButtonProps) => {
  return (
    <button
      className="border border-[rgb(188,183,181)] rounded-lg text-white px-5 py-2"
      style={borderColor ? { borderColor }:undefined}
    >
      {children}
    </button>
  );
};

export default ButtonWithBorder;
