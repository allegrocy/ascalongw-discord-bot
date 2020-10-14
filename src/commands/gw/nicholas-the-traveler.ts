import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class NicholasTheTravelerCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'nicholas-the-traveler',
            aliases: ['nick'],
            group: 'gw',
            memberName: 'nick',
            description: 'Displays current Nicholas the Traveler information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { weeklyCountdown } = getActivityMeta('nicholas-the-traveler');
        const now = new Date();

        const { region, amount, item, area } = getActivity('nicholas-the-traveler', now);

        const output = [
            '__This week:__',
            `Nicholas the Traveler is collecting **${amount} ${item}** ` + 
            `per present at **${area}** in ${region}.`,
            `Moving off in ${weeklyCountdown}!`,
        ];

        return message.say(output);
    }
}
