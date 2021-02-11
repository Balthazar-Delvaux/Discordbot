require('dotenv').config();

import { CommandoClient } from 'discord.js-commando';
import path from 'path';

if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_PREFIX) throw Error(`Token or Prefix not defined in .env`);

const client = new CommandoClient({
    commandPrefix: process.env.DISCORD_PREFIX,
    owner: process.env.DISCORD_OWNER
});


// Initialize Commando Client options
client.registry
    .registerDefaultTypes()
    .registerGroups([
        [`music`, `Music commands`],
        [`other`, `Other commands`]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({ eval: false, ping: false, prefix: false })
    .registerCommandsIn(path.join(__dirname, 'commands'));


client.once(`ready`, () => {
    client.user?.setActivity(`${process.env.DISCORD_PREFIX}help`, { type: `WATCHING` });
    console.log(`Connected as ${client.user?.tag}`);
});


client.on(`error`, error => {
    console.error(error)
});

client.login(process.env.DISCORD_TOKEN);