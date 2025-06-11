import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import * as dotenv from "dotenv";
// dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  // networks: {
  //   sepolia: {
  //     url:
  //       process.env.SEPOLIA_RPC_URL ||
  //       "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Infura 或 Alchemy RPC URL
  //     accounts: [process.env.PRIVATE_KEY], // MetaMask 私钥
  //   },
  // },
};

export default config;
