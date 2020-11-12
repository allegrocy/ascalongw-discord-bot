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
import { MessageAttachment, TextChannel, MessageReaction } from 'discord.js';
import skills from '../../../assets/skills.json';

const IMAGE_SIZE = 64;

const EMOJI_TEMPLATE = '<:template:769885690610712587>';
const EMOJI_ADRENALINE = '<:adrenaline:769885687788732417>';
const EMOJI_ENERGY = '<:energy:769885688966545490>';
const EMOJI_SACRIFICE = '<:sacrifice:769885690607042560>';
const EMOJI_ACTIVATION = '<:activation:769885687700520991>';
const EMOJI_RECHARGE = '<:recharge:769885690204389407>';
const EMOJI_OVERCAST = '<:overcast:769885690221297674>';
const EMOJI_UPKEEP = '<:upkeep:769885690670350377>';

const EMOJI_PROFESSION: Map<Profession, string> = new Map([
    [Profession.None, '<:none:769885691941224449>'],
    [Profession.Warrior, '<:warrior:769885693429678110>'],
    [Profession.Ranger, '<:ranger:769885693685006336>'],
    [Profession.Monk, '<:monk:769885692834480149>'],
    [Profession.Necromancer, '<:necromancer:769885693911498752>'],
    [Profession.Mesmer, '<:mesmer:769885691386789898>'],
    [Profession.Elementalist, '<:elementalist:769885689553747988>'],
    [Profession.Assassin, '<:assassin:769885688363221002>'],
    [Profession.Ritualist, '<:ritualist:769885693392060457>'],
    [Profession.Paragon, '<:paragon:769885693656432690>'],
    [Profession.Dervish, '<:dervish:769885688619204619>'],
]);

const DIGITS = [
    '\u0030\u20E3',
    '\u0031\u20E3',
    '\u0032\u20E3',
    '\u0033\u20E3',
    '\u0034\u20E3',
    '\u0035\u20E3',
    '\u0036\u20E3',
    '\u0037\u20E3',
    '\u0038\u20E3',
    '\u0039\u20E3',
];

// @todo move this somewhere sensible
const assets = path.join(__dirname, '../../../../assets');

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
        client.on('messageReactionAdd',this.onReaction);
        client.on('messageReactionRemove',this.onReaction);
        // https://github.com/AnIdiotsGuide/discordjs-bot-guide/blob/master/coding-guides/raw-events.md
        client.on('raw', this.onRawPacket);
    }
    async onRawPacket(packet: any) {
      const client = <any>this;
      if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) 
        return;
      const channel = await client.channels.fetch(packet.d.channel_id) as TextChannel;
      if (channel.messages.cache.has(packet.d.message_id)) 
        return;
      const message = await channel.messages.fetch(packet.d.message_id);
      const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
      const reaction = message.reactions.resolve(emoji) as MessageReaction;
      const user = await client.users.fetch(packet.d.user_id);
      //if (reaction) 
      //  reaction.users.set(packet.d.user_id, user);
      if (packet.t === 'MESSAGE_REACTION_ADD')
        client.emit('messageReactionAdd', reaction, user);
      if (packet.t === 'MESSAGE_REACTION_REMOVE')
        client.emit('messageReactionRemove', reaction, user);
    }
    async onReaction(reaction: any, user:any) {
      let message = reaction.message;
      var err = function(msg:string) {
        //message.reply(msg);
      }
      
      if(message.author.id != message.client.user.id)
        return err('Not our message.'); // Not our message.
        
      let template = message.content.match(/-- `([^`]+)` --/)[1];
      if(!template)
        return err('Failed to find a template code');
      
      const skillbar = decodeTemplate(template);
      if (!skillbar) 
        return err('Invalid skillbar'); 
        
      const index = DIGITS.indexOf(reaction.emoji.name);
      if(index == -1)
        return err('Not a valid reaction');
      message.edit(buildMessage(skillbar, index - 1));
    }
    async run(message: any, args: {
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
        const result = await message.say(buildMessage(skillbar, 0), attachment);
        const lastMessage = Array.isArray(result) ? result[result.length - 1] : result;
        for (let i = 0; i < skillbar.skills.length; i++) {
          await lastMessage.react(DIGITS[i + 1]);
        }

        return result;
    }
}

function buildMessage(skillbar: Skillbar, skillIndex: number) {
    const skillId = skillbar.skills[skillIndex];
    const skillData = skills[skillId];

    if (!skillData) return null;

    const primary = `${EMOJI_PROFESSION.get(skillbar.primary)} ${getProfessionAbbreviation(skillbar.primary)}`;
    const secondary = `${getProfessionAbbreviation(skillbar.secondary)} ${EMOJI_PROFESSION.get(skillbar.secondary)}`;

    const listAttributes = (attributes: Skillbar['attributes']) => {
        const arr = [];
        for (const attribute in attributes) {
            const attr: Attribute = attribute as unknown as Attribute;
            arr.push(`${getAttributeName(attr)}: **${skillbar.attributes[attr]}**`);
        }
        return arr;
    };

    const skillInfo = [];
    if (skillData.z?.d) skillInfo.push(`-${skillData.z.d} ${EMOJI_UPKEEP}`);
    if (skillData.z?.a) skillInfo.push(`${skillData.z.a} ${EMOJI_ADRENALINE}`);
    if (skillData.z?.e) skillInfo.push(`${skillData.z.e} ${EMOJI_ENERGY}`);
    if (skillData.z?.s) skillInfo.push(`${skillData.z.s} ${EMOJI_SACRIFICE}`);
    if (skillData.z?.c) skillInfo.push(`${skillData.z.c} ${EMOJI_ACTIVATION}`);
    if (skillData.z?.r) skillInfo.push(`${skillData.z.r} ${EMOJI_RECHARGE}`);
    if (skillData.z?.x) skillInfo.push(`${skillData.z.x} ${EMOJI_OVERCAST}`);
    if (skillData.p) skillInfo.push(`Prof: **${getProfessionName(skillData.p)}**`);
    if (skillData.a) skillInfo.push(`Attrb: **${getAttributeName(skillData.a)}**`);
    if (skillData.t) skillInfo.push(`Type: **${getSkillTypeName(skillData)}**`);

    return [
        `${primary} / ${secondary} -- \`${skillbar.template}\` -- ${EMOJI_TEMPLATE}`,
        listAttributes(skillbar.attributes).join(' '),
        '',
        `Skill ${skillIndex + 1}: **${skillData.n}** -- <https://wiki.guildwars.com/wiki/${encodeURIComponent(skillData.n)}>`,
        `${skillData.d}`,
        '',
        skillInfo.join(' '),
    ];
}

function getSkillTypeName(skillData: NonNullable<typeof skills[number]>) {
    return skillData.e ? `Elite ${getTypeName()}` : getTypeName();

    function getTypeName() {
        switch (skillData.t) {
        case 3:
            return 'Stance';
        case 4:
            return 'Hex Spell';
        case 5:
            return 'Spell';
        case 6:
            if (skillData.z?.sp && skillData.z.sp & 0x800000) {
                return 'Flash Enchantment Spell';
            }
            return 'Enchantment Spell';
        case 7:
            return 'Signet';
        case 9:
            return 'Well Spell';
        case 10:
            return 'Touch Skill';
        case 11:
            return 'Ward Spell';
        case 12:
            return 'Glyph';
        case 14:
            switch (skillData.z?.q) {
            case 1:
                return 'Axe Attack';
            case 2:
                return 'Bow Attack';
            case 8:
                switch (skillData.z?.co) {
                case 1:
                    return 'Lead Attack';
                case 2:
                    return 'Off-Hand Attack';
                case 3:
                    return 'Dual Attack';
                default:
                    return 'Dagger Attack';
                }
            case 16:
                return 'Hammer Attack';
            case 32:
                return 'Scythe Attack';
            case 64:
                return 'Spear Attack';
            case 70:
                return 'Ranged Attack';
            case 128:
                return 'Sword Attack';
            }
            return 'Melee Attack';
        case 15:
            return 'Shout';
        case 19:
            return 'Preparation';
        case 20:
            return 'Pet Attack';
        case 21:
            return 'Trap';
        case 22:
            switch (skillData.p) {
            case Profession.Ritualist:
                return 'Binding Ritual';
            case Profession.Ranger:
                return 'Nature Ritual';
            default:
                return 'Ebon Vanguard Ritual';
            }
        case 24:
            return 'Item Spell';
        case 25:
            return 'Weapon Spell';
        case 26:
            return 'Form';
        case 27:
            return 'Chant';
        case 28:
            return 'Echo';
        default:
            return 'Skill';
        }
    }
}