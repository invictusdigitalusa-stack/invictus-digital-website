export default function LonghornPreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-[#061810]">{children}</div>;
}
