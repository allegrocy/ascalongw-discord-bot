import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class GiveCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'give',
            group: 'community',
            memberName: 'give',
            description: 'Starts a giveaway.',
            details: '',
            examples: ['give create'],

            args: []
        });
    }

    async run(message: CommandoMessage, args: string | string[]) {
        // TODO: giveaway creation
        return null;
    }
}
