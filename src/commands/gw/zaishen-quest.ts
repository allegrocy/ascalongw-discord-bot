import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class SkillbarCommand extends Command {
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
        const { endDate } = getActivityMeta('zaishen-mission');
        const now = new Date();

        const zaishenQuestsText = (date: Date) => [
            `Zaishen Mission: **${getActivity('zaishen-mission', date)}**`,
            `Zaishen Bounty: **${getActivity('zaishen-bounty', date)}**`,
            `Zaishen Vanquish: **${getActivity('zaishen-vanquish', date)}**`,
            `Zaishen Combat: **${getActivity('zaishen-combat', date)}**`,
        ];

        const { hours, minutes, seconds } = intervalToDuration({
            start: now,
            end: endDate,
        });

        const resetOutput = [hours, minutes, seconds]
            .map(v => String(v).padStart(2, '0'))
            .join(':');

        return message.say([
            '__Today\'s Zaishen Quests:__',
            ...zaishenQuestsText(now),
            `Zaishen Daily Quest will reset in **${resetOutput}**`,
        ]);
    }
}
