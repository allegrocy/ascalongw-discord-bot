const { Command } = require('discord.js-commando');

module.exports = class SkillbarCommand extends Command {
    constructor(client) {
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

    async run(message, args) {
        // TODO: parse args.template and render bar
    }
};