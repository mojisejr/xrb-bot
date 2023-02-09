import { CacheType, Events, Interaction, CommandInteraction } from "discord.js";
import { client } from "../index";
import { config } from "../config";
import { isValidAddress } from "../helper/walletAddress";
import { getProjectByDiscordId } from "../database/project.service";
import { getBalanceOf } from "../contracts/xrb.contract";
import { VerifyDTO } from "../interfaces/verify.interface";

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
  if (verifyData.length <= 0)
    await interaction.editReply({ content: "no verify data" });

  //verify holder here
}

async function getVerifyData(interaction: CommandInteraction<CacheType>) {
  //1. get user discordId from interaction
  //2. get wallet input from command value
  //3. get check nft balance of this wallet
  const isValid = isValidAddress(interaction.options.data[0].value as string);
  if (!isValid)
    await interaction.editReply({ content: "Error: invalid wallet address" });

  const walletAddress = interaction.options.data[0].value as string;

  const { nftAddresses } = await getProjectByDiscordId(interaction.guild!.id);

  const verifyData = await Promise.all(
    nftAddresses.map(async (nft) => {
      const balance = await getBalanceOf(nft.nftAddress, walletAddress);
      return {
        discordGuildId: interaction.guild!.id,
        userDiscordId: interaction.user.id,
        nftAddress: nft.nftAddress,
        walletAddress,
        balance,
      } as VerifyDTO;
    })
  );

  const sum = verifyData.reduce((a, b) => a.balance + b.balance);

  return { verifyData, sum };
}
