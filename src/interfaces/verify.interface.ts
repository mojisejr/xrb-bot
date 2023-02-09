export interface Verified {
  walletAddress: string;
  nftAddress: string;
  balance: string;
  verified: boolean;
  timestamp: number;
  etherscan?: string;
}

export interface VerifyDTO {
  discordGuildId: string;
  userDiscordId: string;
  nftAddress: string;
  walletAddress: string;
  balance: number;
}
