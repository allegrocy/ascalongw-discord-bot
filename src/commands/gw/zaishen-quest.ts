import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import Discord from 'discord.js';

import {
    ACTIVITIES,
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

import {
    Info,
} from '../../lib/info'

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
        let info = new Info(this.client);
        message.channel.send(info.zaishenQuestText());
        return message.say(info.zaishenQuestEmbed());
    }
}
