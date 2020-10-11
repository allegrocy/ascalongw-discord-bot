const commando = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');

const client = new commando.Client({
    commandPrefix: config.prefix,
    owner: config.owners
});

// TODO: connect to database

client.once('ready', async () => {
    console.log(`Ready! Logged in as ${client.user.username}#${client.user.discriminator}.`);
    console.log(await client.generateInvite());
});

client.registry
    .registerGroups([
        ['community', 'Server community commands'],
        ['gw', 'Guild Wars-related commands']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({
        commandState: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

// Bot token should always be placed in config.json and never committed to repo
client.login(config.token);