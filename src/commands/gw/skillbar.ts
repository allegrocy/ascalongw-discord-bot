import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export default class SkillbarCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'skillbar',
            aliases: ['s'],
            group: 'gw',
            memberName: 's',
            description: 'Previews a skill template.',
            details: '',
            examples: ['s 12341234'],

            args: [
                {
                    key: 'template',
                    prompt: 'enter a skill template code.',
                    type: 'string'
                }
            ]
        });
    }

    async run(message: CommandoMessage, args: string | string[]) {
        // TODO: parse args.template and render bar
        return null;
    }
}
