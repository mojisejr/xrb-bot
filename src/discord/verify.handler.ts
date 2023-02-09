import { CacheType, Events, Interaction, CommandInteraction } from "discord.js";
import { client } from "../index";
import { config } from "../config";
import { isValidAddress } from "../helper/walletAddress";
import { getProjectByDiscordId } from "../database/project.service";
import { getBalanceOf } from "../contracts/xrb.contract";
import { VerifyData } from "../interfaces/verify.interface";
import {
  createOrReturnExsiting,
  createOrUpdateVerifyHolderData,
} from "../database/holder.service";
import { giveRole, takeRole } from "./roles.handler";

client.on(
  Events.InteractionCreate,
  async (interaction) => await onVerify(interaction)
);

async function onVerify(interaction: Interaction<CacheType>) {
  //1. check if collection command
  //2. get userAddress and discordId
  //3. loop check and get all balance of all nfts
  //4. verify save data
  //5. set role
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName == config.commandName) return;
  if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });

  const verifyData = await getVerifyData(interaction);
  //check balance
  if (verifyData.totalBalance <= 0)
    await interaction.editReply({
      content: "you have no any collection of this project",
    });

  //verify holder here
  const result = await verifyHolder(verifyData);

  if (!result) {
    await takeRole(client, interaction.user.id, interaction.guild!.id);
    await interaction.editReply({
      content: "cannot verify this wallet!",
    });
  } else {
    await giveRole(client, interaction.user.id, interaction.guild!.id);
    await interaction.editReply({
      content:
        "your are verifited, check role and some new channel available now",
    });
  }
}

async function getVerifyData(
  interaction: CommandInteraction<CacheType>
): Promise<VerifyData> {
  //1. get user discordId from interaction
  //2. get wallet input from command value
  //3. get check nft balance of this wallet
  const isValid = isValidAddress(interaction.options.data[0].value as string);
  if (!isValid)
    await interaction.editReply({ content: "Error: invalid wallet address" });

  const walletAddress = interaction.options.data[0].value as string;

  const { nftAddresses } = await getProjectByDiscordId(interaction.guild!.id);

  const nftData = await Promise.all(
    nftAddresses.map(async (nft) => {
      const balance = await getBalanceOf(nft.nftAddress, walletAddress);
      return {
        nftAddress: nft.nftAddress,
        balance,
      };
    })
  );

  const totalBalance = nftData
    .map((data) => data.balance)
    .reduce((a, b) => a + b);

  const verifyData = {
    discordGuildId: interaction.guild!.id,
    discordId: interaction.user.id,
    walletAddress,
    totalBalance,
    nftData,
  };

  return verifyData;
}

async function verifyHolder(verifyDataDTO: VerifyData): Promise<boolean> {
  //1 add new holder if not exist
  const holder = await createOrReturnExsiting({
    walletAddress: verifyDataDTO.walletAddress,
    discordId: verifyDataDTO.discordId,
  });

  //2 upate verification data
  const verifiedHolder = await createOrUpdateVerifyHolderData(
    holder,
    verifyDataDTO
  );

  if (verifiedHolder) {
    return true;
  } else {
    return false;
  }
}
