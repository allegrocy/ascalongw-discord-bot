import atob from 'atob';

enum Profession {
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

enum Attribute {
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

interface Skillbar {
	type: 14,
	version: number,
	primary: Profession,
	secondary: Profession,
	attributes: Partial<Record<Attribute, number>>,
	skills: number[];
}

const _base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function decodeTemplate(template: string): Skillbar | null {
	let binary = codetobin(template);
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
	}
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
