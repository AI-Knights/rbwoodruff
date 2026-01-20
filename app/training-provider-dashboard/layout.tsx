import TraingProvider from "@/components/TrainingProviderDeshboard/TrainingProvider/TraingProvider";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <TraingProvider>{children}</TraingProvider>
    </div>
  );
}
