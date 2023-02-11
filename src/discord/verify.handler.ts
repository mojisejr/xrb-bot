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
  isUsedWallet,
  isVerifiedHolder,
} from "../database/holder.service";
import { giveRole, takeRole } from "./roles.handler";

async function onVerify(interaction: Interaction<CacheType>) {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName != config.commandName) return;
  if (!interaction.deferred) await interaction.deferReply({ ephemeral: true });

  const walletAddress = interaction.options.data[0].value as string;
  const discordId = interaction.user.id;
  const guildId = interaction.guild!.id;

  const canVerify = await isVerifiedHolder(discordId, walletAddress, guildId);

  if (!canVerify) {
    await interaction.editReply({ content: "you have been verified" });
    return;
  }

  const usedWallet = await isUsedWallet(walletAddress);

  if (usedWallet) {
    await interaction.editReply({
      content: `${walletAddress} is already used to verify this project!`,
    });
    return;
  }

  const verifyData = await getVerifyData(interaction);
  console.log("nft totalBalance found : ", verifyData.totalBalance);
  //check balance
  if (verifyData.totalBalance <= 0) {
    await interaction.editReply({
      content: "you have no any collection of this project",
    });
    return;
  }

  const result = await verifyHolder(verifyData);

  if (!result) {
    await takeRole(client, discordId, guildId);
    await interaction.editReply({
      content: "cannot verify this wallet!",
    });
    return;
  } else {
    await giveRole(client, discordId, guildId);
    await interaction.editReply({
      content:
        "your are verifited, check role and some new channel available now",
    });
    return;
  }
}

async function getVerifyData(
  interaction: CommandInteraction<CacheType>
): Promise<VerifyData> {
  //1. get user discordId from interaction
  //2. get wallet input from command value
  //3. get check nft balance of this wallet
  const isValid = isValidAddress(interaction.options.data[0].value as string);
  if (!isValid) {
    await interaction.editReply({ content: "Error: invalid wallet address" });
  }

  const walletAddress = interaction.options.data[0].value as string;

  const { nftAddresses } = await getProjectByDiscordId(interaction.guild!.id);

  const nftData = await Promise.all(
    nftAddresses.map(async (nft) => {
      const balance = await getBalanceOf(nft.nftAddress, walletAddress);
      console.log(nft.nftAddress, balance);
      return {
        nftAddress: nft.nftAddress,
        balance,
      };
    })
  );

  const totalBalance =
    nftData.length <= 0
      ? 0
      : nftData.map((data) => data.balance).reduce((a, b) => a + b);

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
  const holder = await createOrReturnExsiting({
    discordId: verifyDataDTO.discordId,
  });

  const verifiedHolder = await createOrUpdateVerifyHolderData(
    holder,
    verifyDataDTO
  );

  if (verifiedHolder != undefined) {
    return true;
  } else {
    return false;
  }
}

export { onVerify };
