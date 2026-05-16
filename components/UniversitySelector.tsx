"use client";

import { UNIVERSITY_OPTIONS } from "@/lib/universities";

interface UniversitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function UniversitySelector({ value, onChange }: UniversitySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {UNIVERSITY_OPTIONS.slice(0, 6).map((university) => (
          <button
            key={university}
            type="button"
            onClick={() => onChange(university)}
            className={`rounded-full border-2 px-4 py-2 text-sm transition ${
              value === university
                ? "border-black bg-[var(--accent-yellow)] text-black"
                : "border-black bg-[var(--card-bg)] text-black/70 hover:bg-[var(--accent-yellow)] hover:text-black"
            }`}
          >
            {university}
          </button>
        ))}
      </div>
      <input
        list="university-options"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search or type your university"
        className="w-full rounded-md border-2 border-black bg-[var(--card-bg)] px-4 py-3 text-black outline-none placeholder:text-black/40 focus:border-[var(--accent-orange)]"
      />
      <datalist id="university-options">
        {UNIVERSITY_OPTIONS.map((university) => (
          <option key={university} value={university} />
        ))}
      </datalist>
    </div>
  );
}
