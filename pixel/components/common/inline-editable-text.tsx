"use client";

import { useEffect, useRef, useState } from "react";

interface InlineEditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function InlineEditableText({
  value,
  onChange,
  className = "",
  inputClassName = "",
  placeholder = "Untitled",
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (internalValue.trim() !== value.trim()) {
      onChange(internalValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={`cursor-pointer group ${className}`}
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") {
              setInternalValue(value); // Revert changes
              setIsEditing(false);
            }
          }}
          className={`bg-transparent border-none outline-none w-full ${inputClassName}`}
        />
      ) : (
        <span className="group-hover:underline group-hover:decoration-wavy group-hover:decoration-blue-600">
          {value || placeholder}
        </span>
      )}
    </div>
  );
}
