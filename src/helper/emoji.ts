import { Profession } from '../lib/skills';

export const DIGITS = [
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

export const PROFESSION: Map<Profession, string> = new Map([
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

export const TEMPLATE = '<:template:769885690610712587>';
export const ADRENALINE = '<:adrenaline:769885687788732417>';
export const ENERGY = '<:energy:769885688966545490>';
export const SACRIFICE = '<:sacrifice:769885690607042560>';
export const ACTIVATION = '<:activation:769885687700520991>';
export const RECHARGE = '<:recharge:769885690204389407>';
export const OVERCAST = '<:overcast:769885690221297674>';
export const UPKEEP = '<:upkeep:769885690670350377>';

export const ZAISHEN_COPPER_COIN = '<:zaishen_copper_coin:796371200280100884>';

export const EDIT = '\uD83D\uDCDD';
