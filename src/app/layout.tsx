import type { Metadata } from "next";
import "./globals.css";
import { WagmiProvider } from "@/components/wagmi-provider-ssr";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/wagmi-config";
import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "SimpleKit",
  description:
    "Responsive connect wallet and account component built on top of Wagmi and shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get("cookie"),
  );

  return (
    <WagmiProvider initialState={initialState}>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <ThemeProvider attribute="class">
            <div vaul-drawer-wrapper="" className="bg-background">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </WagmiProvider>
  );
}
