import { CommandoClient } from 'discord.js-commando';
import Discord from 'discord.js';
import { GuildEmoji } from 'discord.js';

import {
    ACTIVITIES,
    getActivity,
    getActivityMeta,
} from './activities';

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

export class Info {
    client: CommandoClient;
    now: Date;
    copperCoin: GuildEmoji | undefined;
    dailyCountdown: string;

    constructor(client: CommandoClient) {
        this.client = client;
        this.now = new Date();

        /**
         * Get the emoji which the bot has access to (on another server) using the emoji's ID.
         * Right click on the emoji and copy the link.
         * The ID is the name of the image file without the extension.
         */
        this.copperCoin = this.client.emojis.cache.get('796371200280100884');
        this.dailyCountdown = getActivityMeta('zaishen-mission')['dailyCountdown'];
    }

    zaishenQuestText() {
        const zaishenQuestsText = (date: Date) => [
            `ZM: **${getActivity('zaishen-mission', date)}** ${this.copperCoin} 100`,
            `ZB: **${getActivity('zaishen-bounty', date)}** ${this.copperCoin} 105`,
            `ZV: **${getActivity('zaishen-vanquish', date)}** ${this.copperCoin} 175`,
            `ZC: **${getActivity('zaishen-combat', date)}** ${this.copperCoin} 150`,
        ];

        const text = [
            '__Today\'s Zaishen Quests__',
            ...zaishenQuestsText(this.now),
            `_${this.dailyCountdown}_ left`,
        ];

        return text;
    }

    zaishenQuestEmbed() {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Zaishen Quests')
            .setDescription(`_${this.dailyCountdown}_ left`)
            .setURL('https://wiki.guildwars.com/wiki/Zaishen_Challenge_Quest')
            .addFields(
                {
                    name: `Zaishen Mission`,
                    value: [
                        `${getActivity('zaishen-mission', this.now)}`,
                        `100 ${this.copperCoin}`,
                    ],
                    inline: true,
                },
                INLINEBLANKFIELD,
                {
                    name: `Zaishen Bounty`,
                    value: [
                        `${getActivity('zaishen-bounty', this.now)}`,
                        `105 ${this.copperCoin}`,
                    ],
                    inline: true,
                },
                BLANKFIELD,
                {
                    name: `Zaishen Vanquish`,
                    value: [
                        `${getActivity('zaishen-vanquish', this.now)}`,
                        `175 ${this.copperCoin}`,
                    ],
                    inline: true,
                },
                INLINEBLANKFIELD,
                {
                    name: `Zaishen Combat`,
                    value: [
                        `${getActivity('zaishen-combat', this.now)}`,
                        `150 ${this.copperCoin}`,
                    ],
                    inline: true,
                },
            );

        return embed;
    }
}