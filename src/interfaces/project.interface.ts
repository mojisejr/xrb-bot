import { NFT } from "./nft.interface";

export interface Project {
  nftAddresses: NFT[];
  ownerDiscordId?: string;
  discordGuildId: string;
  ownerWalletAddress?: string;
  projectName: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  discordInviteLink?: string;
  roles: string[];
}
