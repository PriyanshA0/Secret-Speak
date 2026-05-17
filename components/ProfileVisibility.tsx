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
      const res = await fetch("/api/users/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileVisible: nextValue }),
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(`Failed to update: ${data?.error || data?.details || "Unknown error"}`);
        return;
      }
      
      setValue(nextValue);
      alert(`Profile visibility updated to ${nextValue ? "Visible" : "Hidden"}`);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update profile visibility"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={loading}
      className="neo-btn rounded-md px-4 py-2 text-sm"
    >
      Profile visibility: {value ? "Visible" : "Hidden"}
    </button>
  );
}
