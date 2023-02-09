import { createContract, getBalanceOf } from "../contracts/xrb.contract";
import { getHolderByWalletAddress } from "../database/holder.service";
import { getProjectByDiscordId } from "../database/project.service";
import { giveRole, takeRole } from "../discord/roles.handler";
import { client } from "../index";

async function transferEventHandler() {
  const project = await getProjectByDiscordId(process.env.discord_guildId);
  project.nftAddresses.forEach((nft) => {
    const contract = createContract(nft.nftAddress);
    contract.on("Transfer", async (from: string) => {
      const market = specialAvoidChecking(from);
      if (!market) {
        const nftData = await Promise.all(
          project.nftAddresses.map(
            async (nft) => await getBalanceOf(nft.nftAddress, from)
          )
        );
        const holder = await getHolderByWalletAddress(from, nft.discordGuildId);
        const sum = nftData.reduce((a, b) => a + b);
        if (sum <= 0) {
          await takeRole(client, holder.discordId, nft.discordGuildId);
        } else {
          await giveRole(client, holder.discordId, nft.discordGuildId);
        }
      }
    });
  });
}

async function specialAvoidChecking(address: string) {
  let marketPlaceAddress = [
    "0x874987257374cAE9E620988FdbEEa2bBBf757cA9",
    "0xd7C1b83B1926Cc6971251D0676BAf239Ee7F804e",
  ];

  let middleAddress = "0xA51b0F76f0d7d558DFc0951CFD74BB85a70E2a95";

  const foundMarket = marketPlaceAddress.find((market) => market == address);

  if (address === foundMarket || address === middleAddress) {
    return true;
  } else {
    return false;
  }
}

export { transferEventHandler };
