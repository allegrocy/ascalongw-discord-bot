import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import { createEmbed } from '../../lib/zaishen-quest';

export = class ZaishenQuestCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'zaishen-quest',
            aliases: ['zq'],
            group: 'gw',
            memberName: 'zq',
            description: 'Displays current Zaishen Quest Information with a countdown',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        return message.say(createEmbed(new Date()));
    }
}
