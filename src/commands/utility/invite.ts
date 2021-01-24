import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import permissions from '../../helper/permissions';

export = class InviteCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Provides a link to invite the bot to your own server',
        });
    }

    async run(message: CommandoMessage) {
        return message.reply(await this.client.generateInvite(permissions));
    }
}
