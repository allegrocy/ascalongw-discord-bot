const { intervalToDuration } = require('date-fns');
const { Command } = require('discord.js-commando');

const {
    getActivity,
    getActivityMeta,
} = require('../../lib/activities');

module.exports = class SkillbarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'zaishen-quest',
            aliases: ['zaishen-quest', 'zq'],
            group: 'gw',
            memberName: 'zq',
            description: 'Displays current Zaishen Quest Information with a countdown',
            details: ''
        });
    }

    async run(message) {
        const { endDate } = getActivityMeta('zaishen-mission');
        const now = new Date();

        const zaishenQuestsText = (date) => [
            `Zaishen Mission: **${getActivity('zaishen-mission', date)}**`,
            `Zaishen Bounty: **${getActivity('zaishen-bounty', date)}**`,
            `Zaishen Vanquish: **${getActivity('zaishen-vanquish', date)}**`,
            `Zaishen Combat: **${getActivity('zaishen-combat', date)}**`,
        ];

        const { hours, minutes, seconds } = intervalToDuration({
            start: now,
            end: endDate,
        });

        const resetOutput = [hours, minutes, seconds]
            .map(v => String(v).padStart(2, '0'))
            .join(':');

        return message.say([
            '__Today\'s Zaishen Quests:__',
            ...zaishenQuestsText(now),
            `Zaishen Daily Quest will reset in **${resetOutput}**`,
        ]);
    }
};
