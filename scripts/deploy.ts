import { ethers } from "hardhat";

async function main() {
  console.log("Deploying EVMAuth contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BNB");

  const EVMAuth = await ethers.getContractFactory("EVMAuth");
  const evmAuth = await EVMAuth.deploy();

  await evmAuth.waitForDeployment();

  const address = await evmAuth.getAddress();
  console.log("EVMAuth deployed to:", address);

  console.log("\nDeployment complete!");
  console.log("Contract address:", address);
  console.log("\nAdd this to your .env file:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);

  // Wait for block confirmations before verification
  console.log("\nWaiting for block confirmations...");
  await evmAuth.deploymentTransaction()?.wait(5);

  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network ${network.name} ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
