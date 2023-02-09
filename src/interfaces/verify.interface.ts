export interface VerifyData {
  discordGuildId: string;
  discordId: string;
  walletAddress: string;
  totalBalance: number;
  nftData: {
    nftAddress: string;
    balance: number;
  }[];
}

export interface Verified {
  walletAddress: string;
  discordId: string;
  discordGuildId: string;
  balance: number;
  verified: boolean;
  nfts: {
    nftAddress: string;
    balance: number;
  }[];
}
