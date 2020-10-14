import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class NicholasTheTraveler extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'nicholas-the-traveler',
            aliases: ['nicholas-the-traveler', 'nick'],
            group: 'gw',
            memberName: 'nick',
            description: 'Displays current Nicholas the Traveler information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { endDate } = getActivityMeta('nicholas-the-traveler');
        const now = new Date();

        const { region, amount, item, area } = getActivity('nicholas-the-traveler', now);

        const { days, hours, minutes, seconds } = intervalToDuration({
            start: now,
            end: endDate,
        });

        const resetOutput = [hours, minutes, seconds]
            .map(v => String(v).padStart(2, '0'))
            .join(':');

        const output = [
            '__This week:__',
            `Nicholas the Traveler is collecting **${amount} ${item}** ` + 
            `per present at **${area}** in ${region}.`,
            `Moving off in **${days} days** and **${resetOutput}**!`,
        ];

        return message.say(output);
    }
}
