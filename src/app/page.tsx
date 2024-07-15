import { ConnectWallet } from "@/components/connect-wallet";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-3.5">
      <section className="flex flex-col items-center gap-y-9">
        <div className="max-w-lg space-y-3.5 text-center">
          <h1 className="text-5xl font-semibold md:text-7xl">SimpleKit</h1>
          <p className="text-balance text-muted-foreground md:text-xl">
            Responsive connect wallet and account component built on top of
            Wagmi and shadcn/ui.
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          <ConnectWallet />
          <Button variant="ghost" className="rounded-xl">
            GitHub &rarr;
          </Button>
        </div>
      </section>

      <footer className="absolute bottom-3.5 mx-auto flex gap-[0.5ch] text-center text-muted-foreground">
        <span>Built with 🩵 by</span>
        <Link
          href="https://x.com/vaunblu"
          target="_blank"
          className="group flex items-center gap-[0.5ch] border-b border-transparent hover:border-muted-foreground"
        >
          Vaun Blu{" "}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </footer>
    </main>
  );
}
