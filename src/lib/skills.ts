export enum Profession {
    None,
    Warrior,
    Ranger,
    Monk,
    Necromancer,
    Mesmer,
    Elementalist,
    Assassin,
    Ritualist,
    Paragon,
    Dervish,
}

const PROFESSION_ABBREVIATION: Record<Profession, string> = {
    [Profession.None]: 'x',
    [Profession.Warrior]: 'W',
    [Profession.Ranger]: 'R',
    [Profession.Monk]: 'Mo',
    [Profession.Necromancer]: 'N',
    [Profession.Mesmer]: 'Me',
    [Profession.Elementalist]: 'E',
    [Profession.Assassin]: 'A',
    [Profession.Ritualist]: 'Rt',
    [Profession.Paragon]: 'P',
    [Profession.Dervish]: 'D',
};

export function getProfessionAbbreviation<T extends keyof typeof PROFESSION_ABBREVIATION>(profession: T): typeof PROFESSION_ABBREVIATION[T] {
    return PROFESSION_ABBREVIATION[profession];
}

const PROFESSION_NAME: Record<Profession, string> = {
    [Profession.None]: 'None',
    [Profession.Warrior]: 'Warrior',
    [Profession.Ranger]: 'Ranger',
    [Profession.Monk]: 'Monk',
    [Profession.Necromancer]: 'Necromancer',
    [Profession.Mesmer]: 'Mesmer',
    [Profession.Elementalist]: 'Elementalist',
    [Profession.Assassin]: 'Assassin',
    [Profession.Ritualist]: 'Ritualist',
    [Profession.Paragon]: 'Paragon',
    [Profession.Dervish]: 'Dervish',
};

export function getProfessionName<T extends keyof typeof PROFESSION_NAME>(profession: T): typeof PROFESSION_NAME[T] {
    return PROFESSION_NAME[profession];
}

export enum Attribute {
    FastCasting, IllusionMagic, DominationMagic, InspirationMagic,
    BloodMagic, DeathMagic, SoulReaping, Curses,
    AirMagic, EarthMagic, FireMagic, WaterMagic, EnergyStorage,
    HealingPrayers, SmitingPrayers, ProtectionPrayers, DivineFavor,
    Strength, AxeMastery, HammerMastery, Swordsmanship, Tactics,
    BeastMastery, Expertise, WildernessSurvival, Marksmanship,
    DaggerMastery = 29, DeadlyArts, ShadowArts,
    Communing, RestorationMagic, ChannelingMagic,
    CriticalStrikes, SpawningPower,
    SpearMastery, Command, Motivation, Leadership,
    ScytheMastery, WindPrayers, EarthPrayers, Mysticism,
    NornRank = 214, EbonVanguardRank, DeldrimorRank, AsuraRank,
    LightbringerRank = 235, SunspearRank = 238,
    LuxonRank = 249, KurzickRank,
}

const ATTRIBUTE_NAMES: Record<Attribute, string> = {
    [Attribute.FastCasting]: 'Fast Casting',
    [Attribute.IllusionMagic]: 'Illusion Magic',
    [Attribute.DominationMagic]: 'Domination Magic',
    [Attribute.InspirationMagic]: 'Inspiration Magic',
    [Attribute.BloodMagic]: 'Blood Magic',
    [Attribute.DeathMagic]: 'Death Magic',
    [Attribute.SoulReaping]: 'Soul Reaping',
    [Attribute.Curses]: 'Curses',
    [Attribute.AirMagic]: 'Air Magic',
    [Attribute.EarthMagic]: 'Earth Magic',
    [Attribute.FireMagic]: 'Fire Magic',
    [Attribute.WaterMagic]: 'Water Magic',
    [Attribute.EnergyStorage]: 'Energy Storage',
    [Attribute.HealingPrayers]: 'Healing Prayers',
    [Attribute.SmitingPrayers]: 'Smiting Prayers',
    [Attribute.ProtectionPrayers]: 'Protection Prayers',
    [Attribute.DivineFavor]: 'Divine Favor',
    [Attribute.Strength]: 'Strength',
    [Attribute.AxeMastery]: 'Axe Mastery',
    [Attribute.HammerMastery]: 'Hammer Mastery',
    [Attribute.Swordsmanship]: 'Swordsmanship',
    [Attribute.Tactics]: 'Tactics',
    [Attribute.BeastMastery]: 'Beast Mastery',
    [Attribute.Expertise]: 'Expertise',
    [Attribute.WildernessSurvival]: 'Wilderness Survival',
    [Attribute.Marksmanship]: 'Marksmanship',
    [Attribute.DaggerMastery]: 'Dagger Mastery',
    [Attribute.DeadlyArts]: 'Deadly Arts',
    [Attribute.ShadowArts]: 'Shadow Arts',
    [Attribute.Communing]: 'Communing',
    [Attribute.RestorationMagic]: 'Restoration Magic',
    [Attribute.ChannelingMagic]: 'Channeling Magic',
    [Attribute.CriticalStrikes]: 'Critical Strikes',
    [Attribute.SpawningPower]: 'Spawning Power',
    [Attribute.SpearMastery]: 'Spear Mastery',
    [Attribute.Command]: 'Command',
    [Attribute.Motivation]: 'Motivation',
    [Attribute.Leadership]: 'Leadership',
    [Attribute.ScytheMastery]: 'Scythe Mastery',
    [Attribute.WindPrayers]: 'Wind Prayers',
    [Attribute.EarthPrayers]: 'Earth Prayers',
    [Attribute.Mysticism]: 'Mysticism',
    [Attribute.NornRank]: 'Norn Rank',
    [Attribute.EbonVanguardRank]: 'Ebon Vanguard Rank',
    [Attribute.DeldrimorRank]: 'Deldrimor Rank',
    [Attribute.AsuraRank]: 'Asura Rank',
    [Attribute.LightbringerRank]: 'Lightbringer Rank',
    [Attribute.SunspearRank]: 'Sunspear Rank',
    [Attribute.LuxonRank]: 'Luxon Rank',
    [Attribute.KurzickRank]: 'Kurzick Rank',
};

export function getAttributeName<T extends keyof typeof ATTRIBUTE_NAMES>(attribute: T): typeof ATTRIBUTE_NAMES[T] {
    return ATTRIBUTE_NAMES[attribute];
}

const TEMPLATE_TYPE = 14;
const VERSION = 0;

export interface Skillbar {
    type: typeof TEMPLATE_TYPE,
    version: typeof VERSION,
    primary: Profession,
    secondary: Profession,
    attributes: Partial<Record<Attribute, number>>,
    skills: number[];
    template: string;
}

const _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function decodeTemplate(template: string): Skillbar | null {
    const binary = codetobin(template);
    let offset = 0;
    const read = (bits: number) => {
        const out = binary.substr(offset, bits);
        offset += bits;
        return binval(out);
    };
    const templateType = read(4);
    if (templateType != TEMPLATE_TYPE) return null;
    const version = read(4) as typeof VERSION;
    const professionBitLength = read(2) * 2 + 4;
    const primary = read(professionBitLength);
    const secondary = read(professionBitLength);

    const attributeCount = read(4);
    const attributeBitLength = read(4) + 4;

    const attributes: Partial<Record<Attribute, number>> = {};

    for (let i = 0; i < attributeCount; i++) {
        attributes[read(attributeBitLength) as Attribute] = read(4);
    }

    const skillBitLength = read(4) + 8;

    const skills = new Array(8);
    for (let i = 0; i < 8; i++) {
        skills[i] = read(skillBitLength);
    }

    return {
        type: templateType,
        version,
        primary,
        secondary,
        attributes,
        skills,
        template,
    };
}

export function encodeSkillbar(skillbar: Exclude<Skillbar, 'template'>): string {
    const type = valbin(skillbar.type, 4);
    const version = valbin(skillbar.version, 4);

    const professionBitLength = Math.max(4, valbin(skillbar.primary, 0).length, valbin(skillbar.secondary, 0).length);
    const primary = valbin(skillbar.primary, professionBitLength);
    const secondary = valbin(skillbar.secondary, professionBitLength);

    const attributeCount = valbin(Object.keys(skillbar.attributes).length, 4);
    const attributeBitLength = Math.max(4, ...Object.keys(skillbar.attributes).map(a => valbin(a, 0).length));
    const attributes = Object.entries(skillbar.attributes).reduce((out, [attributeId, attributeLevel]) => {
        return [
            ...out,
            valbin(attributeId, attributeBitLength),
            valbin(attributeLevel!, 4), // eslint-disable-line @typescript-eslint/no-non-null-assertion
        ];
    }, [] as string[]);

    const skillBitLength = Math.max(8, ...skillbar.skills.map(skillId => valbin(skillId, 0).length));
    const skills = skillbar.skills.map(skillId => valbin(skillId, skillBitLength));

    const template = [
        type,
        version,
        valbin(Math.max(Math.ceil((professionBitLength - 4) / 2), 0), 2),
        primary,
        secondary,
        attributeCount,
        valbin(Math.max(attributeBitLength - 4, 0), 4),
        ...attributes,
        valbin(Math.max(skillBitLength - 8, 0), 4),
        ...skills,
    ];
    return bintocode(template.join(''));
}

function binpadright(s: string, n: number) {
    return s.padEnd(n, '0');
}
function valbin(v: string | number, n: number) {
    return binpadright(strrev(parseInt(v.toString()).toString(2)), n);
}
function binval(b: string) {
    return parseInt(strrev(b), 2);
}
function strrev(s: string) {
    return (s || '').split('').reverse().join('');
}
function charindex(c: string) {
    const n = _base64.length;
    for(let i = 0; i < n; i++) if(_base64.substr(i, 1) == c) return i;
    throw Error;
}

function codetobin(template: string) {
    const length = template.length;
    let binary = '';
    for (let i = 0; i < length; i++) {
        binary += valbin(charindex(template.substr(i, 1)).toString(), 6);
    }
    return binary;
}

function bintocode(bin: string) {
    const r = bin.length % 6;
    let c = '';
    if(r != 0) bin = binpadright(bin, bin.length + 6 - r);
    while(bin.length > 0) {
        c += _base64.substr(parseInt(strrev(bin.substr(0, 6)), 2), 1);
        bin = bin.substr(6);
    }
    return c;
}