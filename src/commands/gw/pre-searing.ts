import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import Discord from 'discord.js';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

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

        /**
         * Create spacing between embed fields.
         * This is necessary because Discord automatically removes normal spaces.
         */
        const blankSpace = '** ** ** ** ** **';

        const output = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Pre Searing Quests')
            .setURL('https://wiki.guildwars.com/wiki/Daily_activities/')
            .addFields(
                {
                    name: `Vanguard Quest${blankSpace}||${blankSpace}`,
                    value: 
                        `${getActivity('vanguard', now)}\n` + 
                        `_${getActivityMeta('vanguard', now)['dailyCountdown']} left_`,
                    inline: true,
                },
                {
                    name: `Nicholas Sanford`,
                    value: 
                        `${getActivity('nicholas-sandford', now)}\n` + 
                        `_${getActivityMeta('nicholas-sandford', now)['dailyCountdown']} left_`,
                    inline: true,
                },
            );

        return message.say(output);
    }
}
