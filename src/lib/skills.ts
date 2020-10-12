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
};

export function getAttributeName<T extends keyof typeof ATTRIBUTE_NAMES>(attribute: T): typeof ATTRIBUTE_NAMES[T] {
    return ATTRIBUTE_NAMES[attribute];
}

export interface Skillbar {
    type: 14,
    version: number,
    primary: Profession,
    secondary: Profession,
    attributes: Partial<Record<Attribute, number>>,
    skills: number[];
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
    if (templateType != 14) return null;
    const version = read(4);
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
    };
}

function binpadright(s: string, n: number) {
    return s.padEnd(n, '0');
}
function valbin(v: string, n: number) {
    return binpadright(strrev(parseInt(v).toString(2)), n);
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
