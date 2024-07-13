import { ConnectWallet } from "@/components/ui/connect-wallet";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <ConnectWallet />
    </main>
  );
}
