"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FilterChipsProps {
  options: string[];
  selectedOptions: Set<string>;
  onToggle: (option: string) => void;
  onClear?: () => void;
}

export function FilterChips({
  options,
  selectedOptions,
  onToggle,
  onClear,
}: FilterChipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const checkHeight = () => {
      if (!containerRef.current) return;
      // 2 rows = ~80px (36px per row + 8px gap)
      if (containerRef.current.scrollHeight > 84) {
        setShowToggle(true);
      } else {
        setShowToggle(false);
      }
    };

    checkHeight();
    const observer = new ResizeObserver(checkHeight);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [options]);

  return (
    <div className="flex flex-col w-full gap-2 px-4 py-2">
      <div
        ref={containerRef}
        className={cn(
          "flex w-full flex-wrap items-center gap-2",
          !isExpanded && "max-h-[85px] overflow-hidden",
        )}
      >
        {onClear && selectedOptions.size > 0 && (
          <button
            onClick={onClear}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-highest"
          >
            <X size={16} className="text-secondary" />
            <span>Curăță</span>
          </button>
        )}

        {options.map((option, index) => {
          const isSelected = selectedOptions.has(option);
          return (
            <button
              key={index}
              onClick={() => onToggle(option)}
              className={cn(
                "relative flex-shrink-0 flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors shadow-sm overflow-hidden", // Added relative and overflow-hidden
                isSelected
                  ? "text-on-primary font-bold shadow-ambient" // Removed gradient classes from button
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
              )}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-br from-primary/10 to-primary-container/10 pointer-events-none" />
              )}
              <span className="relative z-10">{option}</span>{" "}
              {/* Added span for text to be above gradient */}
            </button>
          );
        })}
      </div>

      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm font-medium text-secondary hover:text-on-surface self-start py-1 transition-colors"
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{isExpanded ? "Afișează mai puțin" : "Afișează mai mult"}</span>
        </button>
      )}
    </div>
  );
}
