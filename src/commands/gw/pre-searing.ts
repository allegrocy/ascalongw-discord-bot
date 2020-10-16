import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import Discord from 'discord.js';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

/**
 * A blank field to create spacing between embed fields.
 * The markdown syntax is necessary because Discord ignores whitespace.
 */
const BLANKFIELD = {
    name: '**    **',
    value: '**    **',
    inline: true,
};

export = class PreSearingCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'pre-searing',
            aliases: ['pre'],
            group: 'gw',
            memberName: 'pre',
            description: 'Displays current Pre Searing dailies information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const now = new Date();

        const output = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Pre Searing Quests')
            .setURL('https://wiki.guildwars.com/wiki/Daily_activities')
            .addFields(
                {
                    name: `Vanguard Quest`,
                    value: 
                        `${getActivity('vanguard', now)}\n` + 
                        `_${getActivityMeta('vanguard', now)['dailyCountdown']} left_`,
                    inline: true,
                },
                BLANKFIELD,
                {
                    name: `Nicholas Sandford`,
                    value: 
                        `${getActivity('nicholas-sandford', now)}\n` + 
                        `_${getActivityMeta('nicholas-sandford', now)['dailyCountdown']} left_`,
                    inline: true,
                },
            );

        return message.say(output);
    }
}
