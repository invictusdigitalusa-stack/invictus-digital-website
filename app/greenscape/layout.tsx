export default function GreenScapeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
