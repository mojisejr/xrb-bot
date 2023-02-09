import "./discord/verify.handler";
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

client.login(discord_token);

export { client };
