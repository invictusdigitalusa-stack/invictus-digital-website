"use client";

import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type ToastInput = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

export type ToastItem = ToastInput & {
  id: string;
  type: ToastType;
  duration: number;
};

export type ToastContextValue = {
  toasts: ToastItem[];
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
