import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { Chain } from "wagmi/chains";

const hardhat = {
  id: 31337, // chain id
  name: "Hardhat Localhost",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:8545"],
    },
    public: {
      http: ["http://127.0.0.1:8545"],
    },
  },
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: "ClassToken DApp",
  // 使用的是 MetaMask 而不是 WalletConnect
  // 开发环境使用测试 projectId，生产环境应替换为真实值
  projectId: "demo-project-id",
  chains: [hardhat],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});
