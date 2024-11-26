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

export default function MetaMaskStyleNFTMinter() {
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
    <div className="bg-[#FFFFFF] rounded-xl shadow-lg p-6 w-full max-w-md font-sans">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-[#F6851B] rounded-full p-3">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">NFT Minter</h1>
      <p className="text-gray-600 mb-6 text-center text-sm">Connect your wallet and mint a new NFT</p>
      <div className="space-y-4">
        <button
          onClick={connectMetaMask}
          className="w-full bg-[#037DD6] hover:bg-[#0260A4] text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#037DD6] focus:ring-opacity-50"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#037DD6] text-gray-800 placeholder-gray-500"
            />
            <button
              onClick={mintNFT}
              className="w-full bg-[#F6851B] hover:bg-[#E2761B] text-white font-bold py-3 px-4 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#F6851B] focus:ring-opacity-50"
            >
              Mint NFT
            </button>
          </>
        )}

        {!isMetaMaskAvailable && (
          <p className="text-red-500 text-sm text-center mt-4">MetaMask is not installed. Please install it to use this app.</p>
        )}
      </div>
    </div>
  )
}

