import { projectCol, nftCol } from ".";
import { Project } from "../interfaces/project.interface";
import { NFT } from "../interfaces/nft.interface";

async function getProjectByDiscordId(discordId: string) {
  const projSnapshot = await projectCol.doc(discordId).get();
  const nftSnapshot = await nftCol
    .where("discordGuildId", "==", discordId)
    .get();
  const nfts: NFT[] = nftSnapshot.docs.map((nftData) => nftData.data() as NFT);
  const projectObj = {
    ...projSnapshot.data(),
    nftAddresses: nfts,
  } as Project;
  return projectObj;
}

export { getProjectByDiscordId };
