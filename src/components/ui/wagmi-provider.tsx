"use client";

// 1. Import modules
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { State, WagmiProvider as WagmiProviderBase } from "wagmi";
import { getConfig } from "./wagmi-config";

// 2. Initialize your Wagmi config and a new QueryClient
const config = getConfig();
const queryClient = new QueryClient();

// 3. Create your Wagmi provider
export function WagmiProvider(props: { children: React.ReactNode }) {
  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
