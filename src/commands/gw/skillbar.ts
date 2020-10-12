import { createCanvas, loadImage } from 'canvas';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import {
    Attribute,
    decodeTemplate,
    getAttributeName,
    getProfessionAbbreviation, getProfessionName,
    Profession,
    Skillbar,
} from '../../lib/skills';
import path = require('path');
import { MessageAttachment } from 'discord.js';
import skills from '../../../assets/skills.json';

const IMAGE_SIZE = 64;

const EMOJI_TEMPLATE = '<:Template:384823463644233731>';
const EMOJI_ADRENALINE = '<:Adrenaline:388335958002630658>';
const EMOJI_ENERGY = '<:Energy:384819524244865035>';
const EMOJI_SACRIFICE = ''; // @fixme
const EMOJI_ACTIVATION = '<:Activation:384819522596765697>';
const EMOJI_RECHARGE = '<:Recharge:384819522693103627>';
const EMOJI_OVERCAST = '<:Overcast:384828799424004127>';

const EMOJI_PROFESSION: Record<Profession, string> = {
    [Profession.None]: '<:None:384643466111614976>',
    [Profession.Warrior]: '<:Warrior:384460746748067841>',
    [Profession.Ranger]: '<:Ranger:384460746714644490>',
    [Profession.Monk]: '<:Monk:384460746811244564>',
    [Profession.Necromancer]: '<:Necromancer:384460746983211018>',
    [Profession.Mesmer]: '<:Mesmer:384460746622500864>',
    [Profession.Elementalist]: '<:Elementalist:384460746609786895>',
    [Profession.Assassin]: '<:Assassin:384460746416717835>',
    [Profession.Ritualist]: '<:Ritualist:384460746957914114>',
    [Profession.Paragon]: '<:Paragon:384460746643341332>',
    [Profession.Dervish]: '<:Dervish:384460746643341312>',
};

// @todo move this somewhere sensible
const assets = path.join(__dirname, '../../../assets');

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

        const canvas = createCanvas(8 * IMAGE_SIZE, IMAGE_SIZE);
        const ctx = canvas.getContext('2d');

        const images = await Promise.all(
            skillbar.skills.map(skillID => loadImage(path.join(assets, 'skills', `${skillID}.jpg`)))
        );
        images.map((image, index) => ctx.drawImage(image, index * IMAGE_SIZE, 0, IMAGE_SIZE, IMAGE_SIZE));

        const attachment = new MessageAttachment(canvas.toBuffer(), `${args.template}.png`);

        const skillIndex = 0;
        const skillId = skillbar.skills[skillIndex];
        const skillData = skills[skillId];

        if (!skillData) return null;

        const primary = `${EMOJI_PROFESSION[skillbar.primary]} ${getProfessionAbbreviation(skillbar.primary)}`;
        const secondary = `${getProfessionAbbreviation(skillbar.secondary)} ${EMOJI_PROFESSION[skillbar.secondary]}`;

        const listAttributes = (attributes: Skillbar['attributes']) => {
            const arr = [];
            for (const attribute in attributes) {
                const attr: Attribute = attribute as unknown as Attribute;
                arr.push(`${getAttributeName(attr)}: **${skillbar.attributes[attr]}**`);
            }
            return arr;
        };

        const skillInfo = [];
        if (skillData.z) {
            if (skillData.z.a) skillInfo.push(`${skillData.z.a} ${EMOJI_ADRENALINE}`);
            if (skillData.z.e) skillInfo.push(`${skillData.z.e} ${EMOJI_ENERGY}`);
            if (skillData.z.s) skillInfo.push(`${skillData.z.s} ${EMOJI_SACRIFICE}`);
            if (skillData.z.c) skillInfo.push(`${skillData.z.c} ${EMOJI_ACTIVATION}`);
            if (skillData.z.r) skillInfo.push(`${skillData.z.r} ${EMOJI_RECHARGE}`);
            if (skillData.z.x) skillInfo.push(`${skillData.z.x} ${EMOJI_OVERCAST}`);
        }
        if (skillData.p) skillInfo.push(`Prof: **${getProfessionName(skillData.p)}**`);
        if (skillData.a) skillInfo.push(`Attrb: **${getAttributeName(skillData.a)}**`);
        if (skillData.t) skillInfo.push(`Type: **${skillData.t}**`);

        return message.say([
            `${primary} / ${secondary} -- \`${args.template}\` -- ${EMOJI_TEMPLATE}`,
            listAttributes(skillbar.attributes).join(' '),
            '',
            `Skill ${skillIndex + 1}: **${skillData.n}** -- <https://wiki.guildwars.com/wiki/${encodeURIComponent(skillData.n)}>`,
            `${skillData.d}`,
            '',
            skillInfo.join(' '),
        ], attachment);
    }
}
