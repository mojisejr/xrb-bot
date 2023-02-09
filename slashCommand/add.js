require("dotenv").config();
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

clientId = "1013327146393014292";
guildId = "964899859113078845";

const commands = [
  new SlashCommandBuilder()
    .setName("Rabbitian")
    .setDescription("input wallet that has at least one of XRB collections")
    .addStringOption((option) =>
      option
        .setName("wallet")
        .setDescription(
          "wallet address that has at least one XRB profile nft inside"
        )
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: 9 }).setToken(process.env.token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("successful"))
  .catch(console.error);
