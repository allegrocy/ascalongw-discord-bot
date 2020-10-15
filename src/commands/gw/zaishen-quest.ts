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
        const { dailyCountdown } = getActivityMeta('zaishen-mission');
        const now = new Date();

        const output = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Zaishen Quests')
            .setURL('https://wiki.guildwars.com/wiki/Zaishen_Challenge_Quest')
            .addFields(
                {
                    name: `Zaishen Mission`,
                    value: 
                        `${getActivity('zaishen-mission', now)}\n` + 
                        `_${getActivityMeta('zaishen-mission', now)['dailyCountdown']} left_`,
                    inline: true,
                },
                BLANKFIELD,
                {
                    name: `Zaishen Mission`,
                    value: 
                        `${getActivity('zaishen-bounty', now)}\n` + 
                        `_${getActivityMeta('zaishen-bounty', now)['dailyCountdown']} left_`,
                    inline: true,
                },
                {
                    name: `Zaishen Vanquish`,
                    value: 
                        `${getActivity('zaishen-vanquish', now)}\n` + 
                        `_${getActivityMeta('zaishen-vanquish', now)['dailyCountdown']} left_`,
                    inline: true,
                },
                BLANKFIELD,
                {
                    name: `Zaishen Combat`,
                    value: 
                        `${getActivity('zaishen-combat', now)}\n` + 
                        `_${getActivityMeta('zaishen-combat', now)['dailyCountdown']} left_`,
                    inline: true,
                },
            );

        return message.say(output);
    }
}
