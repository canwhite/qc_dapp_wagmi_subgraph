import { expect } from "chai";
import { ethers } from "hardhat";

describe("ClassToken", function () {
  it("Should have the correct initial supply", async function () {
    // Parse the initial supply (10,000 tokens with 18 decimals)
    const initialSupply = ethers.parseEther("10000.0");

    // Get the contract factory
    const ClassToken = await ethers.getContractFactory("ClassToken");

    // Deploy the contract，deploy completes here
    const token = await ClassToken.deploy(initialSupply);

    // No need for token.deployed() in ethers.js v6
    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(initialSupply);

    console.log("ClassToken deployed to:", token.target); // Use .target for address
  });
});
