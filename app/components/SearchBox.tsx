"use client";

import { Search } from "lucide-react";

export default function SearchBox() {
  return (
    <div className="w-full flex items-center gap-3 bg-gray-200 rounded-full px-4 py-3">
      <Search className="w-5 h-5 text-gray-600" />
      <input
        type="text"
        placeholder="Buscar..."
        className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-500"
      />
    </div>
  );
}
