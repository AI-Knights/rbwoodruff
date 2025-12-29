import { EmployerLayout } from "@/components/employerDashboard/EmployerLayout";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <EmployerLayout>
        {children}
        </EmployerLayout>
    </section>
  );
}
