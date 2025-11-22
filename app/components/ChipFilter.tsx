"use client";

import { useState } from "react";

type ChipFilterProps = {
  label: string;
  colorClass: string;
  onToggle?: (active: boolean) => void;
};

export function ChipFilter({ label, colorClass, onToggle }: ChipFilterProps) {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-3 rounded-full font-medium transition-all ${colorClass} ${
        isActive ? "border border-gray-800 shadow-lg" : "border border-transparent"
      }`}
    >
      {label}
    </button>
  );
}

export default function ChipFilters() {
  const filters = [
    { label: "Servicios", colorClass: "bg-[#E9B63B]" },
    { label: "Tips", colorClass: "bg-[#AAC4F5]" },
    { label: "Comunidades", colorClass: "bg-[#E9B63B]" },
    { label: "Negocios", colorClass: "bg-[#A1BC98]" },
  ];

  return (
    <div className="w-full flex flex-wrap gap-3">
      {filters.map((filter) => (
        <ChipFilter
          key={filter.label}
          label={filter.label}
          colorClass={filter.colorClass}
        />
      ))}
    </div>
  );
}
