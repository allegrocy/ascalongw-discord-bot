import { addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import { getActivityMeta } from '../../lib/activities';
import { createEmbed } from '../../lib/zaishen-quest';

export = class ZaishenQuestNextCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'zaishen-quest-next',
            aliases: ['zqnext', 'zqn'],
            group: 'gw',
            memberName: 'zqnext',
            description: 'Displays tomorrow\'s Zaishen Quest Information with a countdown',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { endDate, startDate } = getActivityMeta('zaishen-mission');

        return message.say(createEmbed(addMilliseconds(new Date(), differenceInMilliseconds(endDate, startDate))));
    }
}
