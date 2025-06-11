// ClassToken deployment module using Hardhat Ignition
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const INITIAL_SUPPLY = ethers.parseEther("10000.0"); // 10000 tokens converted to wei

const ClassTokenModule = buildModule("ClassTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", INITIAL_SUPPLY);

  const token = m.contract("ClassToken", [initialSupply]);

  return { token };
});

export default ClassTokenModule;
