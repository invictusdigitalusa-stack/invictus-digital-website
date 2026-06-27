import { CommandBarProvider } from "@/components/os/CommandBarProvider";
import { ToastProvider } from "@/components/os/ToastProvider";

export default function InternalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
      <CommandBarProvider>{children}</CommandBarProvider>
    </ToastProvider>
  );
}
