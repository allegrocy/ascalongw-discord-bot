import { intervalToDuration } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import Discord from 'discord.js';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

/**
 * An inline blank field to create spacing between embed fields.
 * The markdown syntax is necessary because Discord ignores whitespace.
 */
const INLINEBLANKFIELD = {
    name: '**    **',
    value: '**    **',
    inline: true,
};

/**
 * A non-inline blank field to create spacing between embed fields.
 * The markdown syntax is necessary because Discord ignores whitespace.
 */
const BLANKFIELD = {
    name: '**    **',
    value: '**    **',
    inline: false,
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
            .setDescription(`_${dailyCountdown}_ left`)
            .setURL('https://wiki.guildwars.com/wiki/Zaishen_Challenge_Quest')
            .addFields(
                {
                    name: `Zaishen Mission`,
                    value: [
                        `${getActivity('zaishen-mission', now)}`,
                    ],
                    inline: true,
                },
                INLINEBLANKFIELD,
                {
                    name: `Zaishen Bounty`,
                    value: [
                        `${getActivity('zaishen-bounty', now)}`, 
                    ],
                    inline: true,
                },
                BLANKFIELD,
                {
                    name: `Zaishen Vanquish`,
                    value: [
                        `${getActivity('zaishen-vanquish', now)}`,
                    ],
                    inline: true,
                },
                INLINEBLANKFIELD,
                {
                    name: `Zaishen Combat`,
                    value: [
                        `${getActivity('zaishen-combat', now)}`, 
                    ],
                    inline: true,
                },
            );

        return message.say(output);
    }
}
