import { ethers } from "hardhat";

async function main() {
  // Parse the initial supply (10000 tokens with 18 decimals)
  const initialSupply = ethers.parseEther("10000.0");

  // Get the contract factory
  const ClassToken = await ethers.getContractFactory("ClassToken");

  // Deploy the contract
  const token = await ClassToken.deploy(initialSupply);

  // No need for token.deployed() in ethers.js v6
  console.log("ClassToken deployed to:", token.target); // Use .target instead of .address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
