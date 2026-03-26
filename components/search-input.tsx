"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  initialValue?: string;
  className?: string;
}

export function SearchInput({ 
  placeholder = "Caută produse...", 
  onSearch, 
  initialValue = "",
  className = "" 
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  // Only trigger the parent's search when the debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-surface-container-low px-5 py-4 transition-colors border-b-2 border-transparent focus-within:border-primary ghost-border ${className}`}>
      <Search className="text-secondary" size={24} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-transparent outline-none placeholder:text-secondary text-on-surface font-medium text-lg"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="text-secondary hover:text-on-surface transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
