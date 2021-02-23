import { addDays } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class NicholasTheTravelerNextCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'nicholas-the-traveler-next',
            aliases: ['nicknext', 'nn'],
            group: 'gw',
            memberName: 'nicknext',
            description: 'Displays next Nicholas the Traveler information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { weeklyCountdown } = getActivityMeta('nicholas-the-traveler');
        const now = new Date();
        const nextWeek = addDays(now, 7);

        const { region, amount, item, area } = getActivity('nicholas-the-traveler', nextWeek);

        const output = [
            '__Next week:__',
            `Nicholas will be collecting **${amount} ${item}** ` +
            `per present at **${area}** in ${region}.`,
            `This week's Nicholas will move off in ${weeklyCountdown}!`,
        ];

        return message.say(output);
    }
}
