const commando = require('discord.js-commando');

module.exports = class GiveCommand extends commando.Command {
    constructor(client) {
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

    async run(message, args) {
        // TODO: giveaway creation
    }
};