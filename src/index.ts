import { CommandoClient } from 'discord.js-commando';

import path from 'path';
import config from '../config.json';
import { addUncachedMessageReactionHandler } from './helper/reaction';

const client = new CommandoClient({
    commandPrefix: config.prefix,
    owner: config.owners
});

// TODO: connect to database

client.once('ready', async () => {
    if (!client.user) return;
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}.`);
    console.log(await client.generateInvite());
    addUncachedMessageReactionHandler(client);
});

client.registry
    .registerGroups([
        ['gw', 'Guild Wars-related commands']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        eval: false,
        commandState: false
    })
    .registerCommandsIn({
        dirname: path.join(__dirname, 'commands'),
        filter: /(.+)\.(js|ts)$/,
    });

// Bot token should always be placed in config.json and never committed to repo
client.login(config.token);
