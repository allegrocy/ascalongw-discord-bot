import { addDays } from 'date-fns';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import {
    getActivity,
    getActivityMeta,
} from '../../lib/activities';

export = class weeklyBonusNextCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'weekly-bonus-next',
            aliases: ['bonusnext', 'bn', 'wbn'],
            group: 'gw',
            memberName: 'bonusnext',
            description: 'Displays current weekly bonuses information with a countdown.',
            details: ''
        });
    }

    async run(message: CommandoMessage) {
        const { weeklyCountdown } = getActivityMeta('pve-bonus');
        const now = new Date();
        const nextWeek = addDays(now, 7);

        const pveBonus = getActivity('pve-bonus', nextWeek);
        const pvpBonus = getActivity('pvp-bonus', nextWeek);

        const output = [
            '__Next week:__',
            `PvE bonuses: ${pveBonus['name']} -- **${pveBonus['info']}**`,
            `PvP bonuses: ${pvpBonus['name']} -- **${pvpBonus['info']}**`,
            `This week's bonuses will expire in ${weeklyCountdown}!`,
        ];

        return message.say(output);
    }
}
