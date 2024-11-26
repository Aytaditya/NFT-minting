'use client'

import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { MetaMaskInpageProvider } from "@metamask/providers"

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider
  }
}

const CONTRACT_ADDRESS = "0x596C96f343187DDA2FB40358b272196764B6aD79"
const ABI = [
  {
    "inputs": [{ "internalType": "string", "name": "tokenURI", "type": "string" }],
    "name": "mintNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function",
  },
]

export default function NFTMinter() {
  const [account, setAccount] = useState<string | null>(null)
  const [tokenURI, setTokenURI] = useState<string>("")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setIsMetaMaskAvailable(true)
    }
    setIsMounted(true)
  }, [])

  const connectMetaMask = async () => {
    if (isMetaMaskAvailable) {
      try {
        const ethereum = window.ethereum
        if (!ethereum) {
          throw new Error("MetaMask is not available")
        }

        const accounts: (string | undefined)[] | null | undefined = await ethereum.request({ method: "eth_requestAccounts" })
        const validAccounts: string[] = accounts ? accounts.filter((account): account is string => account !== undefined) : []

        if (Array.isArray(accounts) && accounts.length > 0) {
          const selectedAccount = accounts[0]
          setAccount(selectedAccount)

          const ethersProvider = new ethers.providers.Web3Provider(ethereum)
          setProvider(ethersProvider)

          const signer = ethersProvider.getSigner()
          console.log("Signer address:", await signer.getAddress())
        } else {
          alert("No accounts found in MetaMask.")
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
        alert("Failed to connect to MetaMask.")
      }
    }
  }

  const mintNFT = async () => {
    try {
      if (!tokenURI) return alert("Token URI is required!")
      if (!provider) return alert("Please connect your MetaMask wallet.")

      const signer = provider.getSigner()
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)

      const tx = await nftContract.mintNFT(tokenURI)
      alert("Transaction sent. Waiting for confirmation...")
      await tx.wait()
      alert("NFT minted successfully!")
    } catch (error) {
      console.error("Error minting NFT:", error)
      alert("Error minting NFT!")
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Mint Your NFT</h1>
      <p className="text-gray-600 mb-6 text-center">Connect your wallet and mint a new NFT</p>
      <div className="space-y-4">
        <button
          onClick={connectMetaMask}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : "Connect MetaMask"}
        </button>

        {account && (
          <>
            <input
              type="text"
              placeholder="Enter token URI"
              value={tokenURI}
              onChange={(e) => setTokenURI(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
            <button
              onClick={mintNFT}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Mint NFT
            </button>
          </>
        )}

        {!isMetaMaskAvailable && (
          <p className="text-red-500 text-sm text-center">MetaMask is not installed. Please install it to use this app.</p>
        )}
      </div>
    </div>
  )
}

