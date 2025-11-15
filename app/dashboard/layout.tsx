import { AdminLayout } from "@/components/dashboard/AdminLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <AdminLayout>{children}</AdminLayout>
    </section>
  );
}
