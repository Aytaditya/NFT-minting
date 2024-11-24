/* eslint-disable */

const { ethers } = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("NFTMinting");
  const myContract = await MyContract.deploy();
  await myContract.deployed();

  console.log("Contract deployed to:", myContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
