"use client";

import { useCallback, useMemo, useState } from "react";
import { Toast } from "./Toast";
import {
  ToastContext,
  type ToastInput,
  type ToastItem,
  type ToastType,
} from "./useToast";

const DEFAULT_DURATION = 4000;

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((input: ToastInput) => {
    const id = createToastId();
    const toast: ToastItem = {
      id,
      title: input.title,
      description: input.description,
      type: (input.type ?? "info") as ToastType,
      duration: input.duration ?? DEFAULT_DURATION,
    };

    setToasts((current) => [...current, toast]);

    return id;
  }, []);

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast, toasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-6 right-6 z-[70] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
