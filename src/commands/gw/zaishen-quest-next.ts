import { addDays } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class ZaishenQuestNextCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'zaishen-quest-next',
            aliases: ['zqnext'],
            group: 'gw',
            memberName: 'zqnext',
            description: 'Displays tomorrow\'s Zaishen Quest Information with a countdown',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { dailyCountdown } = getActivityMeta('zaishen-mission');
        const now = new Date();
        const nextDay = addDays(now, 1);

        const zaishenQuestsText = (date: Date) => [
            `Zaishen Mission: **${getActivity('zaishen-mission', date)}**`,
            `Zaishen Bounty: **${getActivity('zaishen-bounty', date)}**`,
            `Zaishen Vanquish: **${getActivity('zaishen-vanquish', date)}**`,
            `Zaishen Combat: **${getActivity('zaishen-combat', date)}**`,
        ];

        return message.say([
            '__Next week\'s Zaishen Quests:__',
            ...zaishenQuestsText(nextDay),
            `Today's Zaishen Quests will reset in ${dailyCountdown}`,
        ]);
    }
}
