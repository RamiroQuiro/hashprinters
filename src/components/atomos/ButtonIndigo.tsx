import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "secondary" | "destructive"|"blanco"|"outline"|"success"|"warning"|"danger";
};

export default function BotonIndigo({ children, className, onClick,variant }: Props) {


  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full border border-transparent bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors duration-200 hover:bg-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${className} ${variant === "default" ? "bg-indigo-100 text-indigo-700" : variant === "secondary" ? "bg-indigo-200 text-indigo-600" : "bg-indigo-300 text-indigo-500"}`}
    >
      {children}
    </button>
  );
}
