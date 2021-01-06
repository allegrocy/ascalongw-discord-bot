import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import axios from 'axios';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const trade_website = 'https://kamadan.gwtoolbox.com';
const max_results = 10;

interface SearchEntry {
    t: number;
    s: string;
    m: string;
}

export default class PricecheckCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'pricecheck',
            aliases: ['pc'],
            group: 'gw',
            memberName: 'pc',
            description: `Queries ${trade_website} for trade results.`,
            details: '',
            examples: ['pc q9 torm shield'],
            args: [
                {
                    key: 'search',
                    prompt: 'enter a search term.',
                    type: 'string'
                }
            ]
        });
    }

    async run(message: CommandoMessage, args: {
        search: string,
    }) {
        const sayResult = await message.say(`Searching for **${args.search}**, just a sec...`);
        const searchMessage = Array.isArray(sayResult) ? sayResult[sayResult.length - 1] : sayResult;

        const enc_search = encodeURIComponent(args.search);
        const response = await axios.get<SearchEntry>(`${trade_website}/s/${enc_search}`);

        if (response.status !== 200) {
            return searchMessage.edit(`Sorry, something went wrong fetching results from ${trade_website}.`);
        }

        const json = response.data;
        if (!Array.isArray(json) || !json.length) {
            return searchMessage.edit(`No results found for **${args.search}**`);
        }

        const results = json.map(data => {
            const sender = data.s.padStart(20, ' ');
            const time = formatDistanceToNow(new Date(data.t));
            const prefix = `${sender}, ${time}:`.padEnd(40, ' ');
            return `${prefix} ${data.m}`;
        });

        const shownResults = results.slice(0, max_results);

        return await searchMessage.edit([
            `Latest ${shownResults.length} results for **${args.search}** from ${trade_website}/search/${enc_search}`,
            `\`\`\`${shownResults.join('\n')}\`\`\``,
        ]);
    }
}
