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
            className={`rounded-full border px-4 py-2 text-sm transition ${
              value === university
                ? "border-fuchsia-300 bg-fuchsia-400/20 text-white"
                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
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
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-300/40"
      />
      <datalist id="university-options">
        {UNIVERSITY_OPTIONS.map((university) => (
          <option key={university} value={university} />
        ))}
      </datalist>
    </div>
  );
}
