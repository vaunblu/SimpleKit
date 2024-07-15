import { ConnectWalletButton } from "@/components/simplekit";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-3.5">
      <section className="flex flex-col items-center gap-y-9">
        <div className="max-w-lg space-y-3.5 text-center">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">
            SimpleKit
          </h1>
          <p className="md:text-balance text-muted-foreground md:text-xl">
            Responsive connect wallet and account component built on top of
            Wagmi and shadcn/ui.
          </p>
        </div>
        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          <ConnectWalletButton />
          <Link href="https://github.com/vaunblu/SimpleKit" target="_blank">
            <Button variant="ghost" className="rounded-xl">
              GitHub &rarr;
            </Button>
          </Link>
        </div>
      </section>

      <footer className="absolute bottom-3.5 mx-auto flex items-center gap-[0.5ch] text-center text-muted-foreground">
        <span>Built by</span>
        <Image
          src="https://utfs.io/f/bef33522-69e9-4afe-a242-6f27f8f96fb7-qs7q98.png"
          alt="vaunblu logo"
          width={32}
          height={32}
          unoptimized
          className="size-5"
        />
        <Link
          href="https://x.com/vaunblu"
          target="_blank"
          className="group flex items-center gap-[0.5ch] underline-offset-4 hover:underline"
        >
          Vaun Blu{" "}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </footer>
    </main>
  );
}
