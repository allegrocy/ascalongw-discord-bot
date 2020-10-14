import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class weeklyBonus extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'weekly-bonus',
            aliases: ['weekly-bonus', 'bonus'],
            group: 'gw',
            memberName: 'bonus',
            description: 'Displays current weekly bonuses information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { endDate } = getActivityMeta('nicholas-the-traveler');
        const now = new Date();

        const pveBonus = getActivity('pve-bonus', now);
        const pvpBonus = getActivity('pvp-bonus', now);

        const { days, hours, minutes, seconds } = intervalToDuration({
            start: now,
            end: endDate,
        });

        const resetOutput = [hours, minutes, seconds]
            .map(v => String(v).padStart(2, '0'))
            .join(':');

        const output = [
            '__This week:__',
            `PvE bonuses: ${pveBonus['name']} -- **${pveBonus['info']}**`,
            `PvP bonuses: ${pvpBonus['name']} -- **${pvpBonus['info']}**`,
            `Weekly bonuses will expire in **${days} days** and **${resetOutput}**!`,
        ];

        return message.say(output);
    }
}
