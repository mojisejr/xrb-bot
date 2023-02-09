import "./discord/verify.handler";
import "./events/transfer";
import * as dotenv from "dotenv";
import { Client, Events, GatewayIntentBits } from "discord.js";
dotenv.config();
const { discord_token } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (data) => {
  console.log(`XRB ready !  => ${data.user.tag}`);
});

client.login(discord_token);

export { client };
