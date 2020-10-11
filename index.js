const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

// Bot token should always be placed in config.json and never committed to repo
client.login(config.token);