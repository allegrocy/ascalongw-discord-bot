import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class weeklyBonusCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'weekly-bonus',
            aliases: ['bonus', 'wb', 'b'],
            group: 'gw',
            memberName: 'bonus',
            description: 'Displays current weekly bonuses information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { weeklyCountdown } = getActivityMeta('pve-bonus');
        const now = new Date();

        const pveBonus = getActivity('pve-bonus', now);
        const pvpBonus = getActivity('pvp-bonus', now);

        const output = [
            '__This week:__',
            `PvE bonuses: ${pveBonus['name']} -- **${pveBonus['info']}**`,
            `PvP bonuses: ${pvpBonus['name']} -- **${pvpBonus['info']}**`,
            `Weekly bonuses will expire in ${weeklyCountdown}!`,
        ];

        return message.say(output);
    }
}
