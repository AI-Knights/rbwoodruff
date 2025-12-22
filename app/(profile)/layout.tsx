import { ProfileLayout } from "@/components/profile/ProfileLayout";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <ProfileLayout>
        <Toaster/>
        {children}
        </ProfileLayout>
    </section>
  );
}
