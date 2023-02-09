import { Verified } from "./verify.interface";

export interface Holder {
  discordId: string;
  discordName: string;
  walletAddress: string;
  verifyData: Verified[];
}

export interface CreateHolderDTO {
  nftAddress: string;
  discordId: string;
  walletAddress: string;
  balance: number;
}
