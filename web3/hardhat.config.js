/* eslint-disable */
require("@nomiclabs/hardhat-waffle");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/4a0c53a5e4d34ddfa9725982d54c25b5",
      accounts: [process.env.NEXT_PUBLIC_PRIVATE_KEY]
    }
  }
};


// Contract deployed to: 0x596C96f343187DDA2FB40358b272196764B6aD79

