"use client";

import { Switch } from "@headlessui/react";

export default function Toggle({ checked, onChange, icon }: { checked: boolean; onChange: () => void; icon: string }) {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer select-none ${
        checked ? "bg-[var(--color-gold)]" : "bg-[var(--color-snow)]/20"
      }`}
    >
      <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-white transition-transform text-xs ${
        checked ? "translate-x-5.5" : "translate-x-0.5"
      }`}>
        {icon}
      </span>
    </Switch>
  );
}