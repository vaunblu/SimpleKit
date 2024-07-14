import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WagmiProvider } from "@/components/wagmi-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SimpleKit",
  description:
    "A responsive connect wallet and account component built on top of Wagmi and shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WagmiProvider>
      <html lang="en">
        <body className={inter.className}>
          <div vaul-drawer-wrapper="" className="bg-background">
            {children}
          </div>
        </body>
      </html>
    </WagmiProvider>
  );
}
