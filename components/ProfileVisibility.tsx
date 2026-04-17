"use client";

import { useState } from "react";

interface ProfileVisibilityProps {
  initialValue: boolean;
}

export default function ProfileVisibility({ initialValue }: ProfileVisibilityProps) {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  async function onToggle() {
    setLoading(true);
    const nextValue = !value;
    try {
      await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileVisible: nextValue }),
      });
      setValue(nextValue);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
    >
      Profile visibility: {value ? "Visible" : "Hidden"}
    </button>
  );
}
