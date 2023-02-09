import { ethers } from "ethers";
import { abi } from "./xrb.abi";

const provider = new ethers.JsonRpcProvider("https://rpc.bitkubchain.io");

function createContract(nftAddress: string): ethers.Contract {
  return new ethers.Contract(nftAddress, abi, provider);
}

async function getBalanceOf(nftAddress: string, walletAddress: string) {
  const contract = createContract(nftAddress);
  const balance = (await contract.balanceOf(walletAddress)).toString();
  return parseInt(balance);
}

export { createContract, getBalanceOf };
