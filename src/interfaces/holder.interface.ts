import { Verified } from "./verify.interface";

export interface Holder {
  discordId: string;
  verified?: Verified[];
}

export interface CreateHolderDTO {
  discordId: string;
}
