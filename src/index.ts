import { onVerify } from "./discord/verify.handler";
import { transferEventHandler } from "./events/transfer";
import * as dotenv from "dotenv";
import { Client, Events, GatewayIntentBits } from "discord.js";
dotenv.config();
const { discord_token } = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.once(Events.ClientReady, async (data) => {
  await transferEventHandler();
  console.log(`XRB ready !  => ${data.user.tag}`);
});

client.on(
  Events.InteractionCreate,
  async (interaction) => await onVerify(interaction)
);

client.login(discord_token);

process.on("uncaughtException", (error) => {
  console.log("uncaughtException: ", error);
});

process.on("unhandledRejection", (error) => {
  console.log("unhandledRejection: ", error);
});

export { client };
