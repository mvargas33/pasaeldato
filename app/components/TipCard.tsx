"use client";

import { useState } from "react";
import { User } from "lucide-react";

type TipCardProps = {
  avatar?: string;
  title: string;
};

export default function TipCard({ avatar, title }: TipCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full bg-gray-200 rounded-lg px-6 py-5 flex items-center gap-4 shadow-md">
      {/* Avatar */}
      <div className="w-16 h-16 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
        <User className="w-8 h-8 text-gray-600" />
      </div>
      
      {/* Title */}
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{title}</p>
      </div>
      
      {/* Dropdown Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex-shrink-0 transition-transform w-16 h-16 flex items-center justify-center"
        style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 22C15.3 22 14.7 21.7 14.3 21.2L8.3 13.2C7.5 12.1 8.3 10.5 9.7 10.5H22.3C23.7 10.5 24.5 12.1 23.7 13.2L17.7 21.2C17.3 21.7 16.7 22 16 22Z" fill="#CE7E5A" stroke="#CE7E5A" strokeWidth="1" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
