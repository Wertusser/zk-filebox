"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { ProductsTable } from "@/components/product-table";
import { ProtocolStatistics } from "@/components/protocol-statistics";

const config = getDefaultConfig({
  appName: "zkFilebox",
  projectId: "YOUR_PROJECT_ID",
  chains: [sepolia],
  ssr: true,
});
const queryClient = new QueryClient();

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Header />
          <div className="flex flex-1 flex-col items-center">
            <div className="@container/main flex flex-1 flex-col gap-2 w-5xl">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <ProtocolStatistics />
                <ProductsTable data={[]} />
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

/**
 * Seller page
 * - Products table
 * - Protocol statistics
 * - Ativity table
 * - "No products" component
 * - "Create identity" form
 * - "Create product" form
 * - "Product creation status" modal
 *
 * Buyer pahe
 *  - checkout page
 *  -
 */
