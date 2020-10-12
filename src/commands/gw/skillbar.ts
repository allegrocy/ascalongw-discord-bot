import { createCanvas, loadImage } from 'canvas';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { decodeTemplate } from '../../lib/skills';
import path = require('path');
import { MessageAttachment } from 'discord.js';

const assets = path.join(__dirname, '../../../assets'); // @todo move this somewhere sensible

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

    async run(message: CommandoMessage, args: {
        template: string,
    }) {
        const skillbar = decodeTemplate(args.template);

        if (!skillbar) return null;

        const IMAGE_SIZE = 64;

        const canvas = createCanvas(8* IMAGE_SIZE, IMAGE_SIZE);
        const ctx = canvas.getContext('2d');

        const images = await Promise.all(
            skillbar.skills.map(skillID => loadImage(path.join(assets, 'skills', `${skillID}.jpg`)))
        );
        images.map((image, index) => ctx.drawImage(image, index * IMAGE_SIZE, 0, IMAGE_SIZE, IMAGE_SIZE));

        const attachment = new MessageAttachment(canvas.toBuffer(), `${args.template}.png`);

        return message.say([
            `template: \`${args.template}\``,
        ], attachment);
    }
}
