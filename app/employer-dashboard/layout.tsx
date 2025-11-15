import { EmployerLayout } from "@/components/employerDashboard/AdminLayout";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <EmployerLayout>
        <Toaster/>
        {children}
        </EmployerLayout>
    </section>
  );
}
