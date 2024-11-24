const hre = require("hardhat");

async function main() {
  const NFTMinting = await hre.ethers.getContractFactory("NFTMinting");
  const nftMinting = await NFTMinting.deploy();
  await nftMinting.deployed();

  console.log("NFTMinting contract deployed to:", nftMinting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
