import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/web3-provider-ssr";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { getConfig } from "@/lib/wagmi-config";
import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  metadataBase: new URL("https://simplekit.vaunb.lu"),
  title: "SimpleKit",
  description:
    "Responsive connect wallet and account component built on top of Wagmi and shadcn/ui.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "shadcn/ui",
    "Wagmi",
    "ConnectKit",
    "Vercel",
    "Web3",
  ],
  authors: [
    {
      name: "vaunblu",
      url: "https://vaunb.lu",
    },
  ],
  creator: "vaunblu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://simplekit.vaunb.lu",
    title: "SimpleKit",
    description:
      "Responsive connect wallet and account component built on top of Wagmi and shadcn/ui.",
    siteName: "SimpleKit",
    images: [
      {
        url: "https://simplekit.vaunb.lu/og.png",
        width: 1200,
        height: 630,
        alt: "SimpleKit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SimpleKit",
    description:
      "Responsive connect wallet and account component built on top of Wagmi and shadcn/ui.",
    images: ["https://simplekit.vaunb.lu/og.png"],
    creator: "@vaunblu",
  },
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
    <Web3Provider initialState={initialState}>
      <html lang="en" suppressHydrationWarning>
        <body className={GeistSans.className}>
          <ThemeProvider attribute="class">
            <div vaul-drawer-wrapper="" className="bg-background">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </Web3Provider>
  );
}
