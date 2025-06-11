import { ethers } from "hardhat";
import * as fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Blog = await ethers.getContractFactory("Blog");
  const blog = await Blog.connect(deployer).deploy("My blog");

  await blog.waitForDeployment();

  const configPath = path.join(__dirname, "../config.js");
  const contractAddress = await blog.getAddress();
  const startBlock = await ethers.provider.getBlockNumber();

  const configContent = `
export const contractAddress = "${contractAddress}"
export const ownerAddress = "${deployer.address}"
export const startBlock = ${startBlock}`.trim();

  fs.writeFileSync(configPath, configContent.trim());
  console.log(`Configuration written to ${configPath}`);
  console.log(`Contract address: ${contractAddress}`);
  console.log(`Owner address: ${deployer.address}`);
  console.log(`Start block: ${startBlock}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
