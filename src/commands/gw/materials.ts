import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { getMaterial } from '../../lib/materials';
import axios from 'axios';

const trade_website = 'https://kamadan.gwtoolbox.com';

interface TraderQuotes {
    buy: Record<string, TraderQuote>;
}

interface TraderQuote {
    p: number;
    t: number;
}

export default class MaterialsCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'materials',
            aliases: ['mats'],
            group: 'gw',
            memberName: 'mats',
            description: `Queries ${trade_website} for current material trader prices.`,
            details: '',
            examples: ['mats']
        });
    }

    async run(message: CommandoMessage) {
        const sayResult = await message.say('Fetching current material prices, just a sec...');
        const fetchMessage = Array.isArray(sayResult) ? sayResult[sayResult.length - 1] : sayResult;

        const response = await axios.get<TraderQuotes>(`${trade_website}/trader_quotes`);

        if (response.status !== 200) {
            return fetchMessage.edit(`Sorry, something went wrong fetching results from ${trade_website}.`);
        }

        const json = response.data;

        if (!json || !json.buy) {
            return fetchMessage.edit(`Sorry, something went wrong fetching results from ${trade_website}`);
        }

        const results = Object.keys(json.buy).map(modelId => {
            const data = json.buy[modelId];
            const item = getMaterial(+modelId);
            if (!item) return;
            return `${item.name}: ${abbreviatePrice(data.p, 2)}`;
        }).filter(value => !!value);

        return fetchMessage.edit([
            `Latest trader prices from ${trade_website}`,
            '>>> ' + `${results.join('\n')}`
        ]);
    }
}

function abbreviatePrice(price: number, digits: number) {
    let value = price;
    const suffixes = ['g', 'k'];
    let suffix = 0;
    while (value >= 1000 && suffix < suffixes.length) {
        value /= 1000;
        suffix++;
    }

    return `${value.toFixed(suffix === 0 ? 0 : digits)}${suffixes[suffix]}`;
}
