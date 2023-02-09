import { Client } from "discord.js";
import { getProjectByDiscordId } from "../database/project.service";

async function giveRole(
  client: Client,
  userId: string,
  discordGuildId: string
) {
  const project = await getProjectByDiscordId(discordGuildId);
  const server = client.guilds.cache.get(discordGuildId);
  const role = server!.roles.cache.find(
    (role) => role.name === project.roles[0]
  );
  const member = await server!.members.fetch();
  const user = member.get(userId);
  await user!.roles.add(role!);
  console.log(`@${userId} set to be ${role!.name}`);
}

async function takeRole(
  client: Client,
  userId: string,
  discordGuildId: string
) {
  const project = await getProjectByDiscordId(discordGuildId);
  const server = client.guilds.cache.get(discordGuildId);
  const role = server!.roles.cache.find(
    (role) => role.name === project.roles[0]
  );
  const member = await server!.members.fetch();
  const user = member.get(userId);
  await user!.roles.remove(role!);
  console.log(`@${userId} remove from ${role!.name}`);
}

export { giveRole, takeRole };
