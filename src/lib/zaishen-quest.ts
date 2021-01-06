import { ACTIVITIES, getActivity, getActivityMeta } from './activities';
import { MessageEmbed } from 'discord.js';
import { isFuture } from 'date-fns';

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

export function createEmbed(date: Date = new Date()) {
    const activity = getActivityMeta('zaishen-mission', date);

    function createActivityField(name: string, type: keyof typeof ACTIVITIES) {
        return {
            name,
            value: [
                getActivity(type, date),
                // @todo display reward
                // `${ZAISHEN_COPPER_COIN} 100`,
            ],
            inline: true,
        };
    }

    const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Zaishen Quests')
        .setURL('https://wiki.guildwars.com/wiki/Zaishen_Challenge_Quest')
        .addFields([
            createActivityField('Zaishen Mission', 'zaishen-mission'),
            INLINEBLANKFIELD,
            createActivityField('Zaishen Bounty', 'zaishen-bounty'),
            BLANKFIELD,
            createActivityField('Zaishen Vanquish', 'zaishen-vanquish'),
            INLINEBLANKFIELD,
            createActivityField('Zaishen Combat', 'zaishen-combat'),
        ]);

    if (isFuture(activity.startDate)) {
        embed.setFooter(`Starts in ${activity.dailyCountdown}`);
    }
    else if (isFuture(activity.endDate)) {
        embed.setFooter(`Ends in ${activity.dailyCountdown}`);
    }

    return embed;
}