import { createCanvas, loadImage, Image as CanvasImage } from 'canvas';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import {
    decodeTemplate
} from '../../lib/skills';
import path = require('path');
import { MessageAttachment } from 'discord.js';

const IMAGE_SIZE = 64;

// @todo move this somewhere sensible
const assets = path.join(__dirname, '../../../assets');

export default class TeambuildCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'teambuild',
            aliases: ['tb'],
            group: 'gw',
            memberName: 't',
            description: 'Previews a team skill template.',
            details: '',
            examples: ['tb 12341234'],

            args: [
                {
                    key: 'templates',
                    prompt: 'enter valid skill template codes',
                    type: 'string',
                    infinite: true,
                }
            ]
        });
    }

    async run(message: CommandoMessage, args: {
        templates: string[],
    }) {
        const skillbars = args.templates.map(decodeTemplate).filter(skillbar => skillbar !== null);
        const canvas = createCanvas(8 * IMAGE_SIZE, skillbars.length * IMAGE_SIZE);
        const ctx = canvas.getContext('2d');

        const images = await Promise.all(skillbars.reduce((acc, skillbar) => {
            return [...acc, ...skillbar!.skills.map(skillID => loadImage(path.join(assets, 'skills', `${skillID}.jpg`)))];
        }, [] as Promise<CanvasImage>[]));

        images.forEach((image, index) => ctx.drawImage(image, (index % 8) * IMAGE_SIZE, Math.floor(index / 8) * IMAGE_SIZE, IMAGE_SIZE, IMAGE_SIZE));

        const attachment = new MessageAttachment(canvas.toBuffer(), `${args.templates.join('|')}.png`);

        return await message.say('', attachment);
    }
}
