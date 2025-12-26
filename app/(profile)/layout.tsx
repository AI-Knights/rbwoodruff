import { ProfileLayout } from "@/components/profile/ProfileLayout";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1920px] mx-auto">
      <ProfileLayout>
        {children}
        </ProfileLayout>
    </section>
  );
}
