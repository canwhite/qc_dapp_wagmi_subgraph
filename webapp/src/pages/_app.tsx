import type { AppProps } from "next/app";
import { Layout } from "@/components/layout";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi"; //replace
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; //replace swr
import { config } from "../wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster />
          </Layout>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
