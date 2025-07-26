export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="min-h-[calc(100vh-10rem)]">{children}</section>;
}
