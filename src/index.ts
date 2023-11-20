import { GatewayIntentBits } from "discord.js";

import Client from "@classes/Client";
import Log from "@schemas/Log";

import dotenv from "dotenv";

import { Level } from "@enums/level";

Log.emit(`Require main path is ${require.main?.path}`, Level.Debug);

dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ]
}, process.env.token ?? "", process.env.id ?? "");

export default client;

client.start();