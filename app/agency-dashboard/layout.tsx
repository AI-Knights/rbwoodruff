import { AgencyLayout } from "@/components/agencyDashboard/AgencyLayout";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <AgencyLayout>
        <Toaster/>
        <div className="p-4 lg:p-0">
          {children}
        </div>
        </AgencyLayout>
    </section>
  );
}
