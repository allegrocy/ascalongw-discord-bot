import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import axios from 'axios';

const wiki_website = 'https://wiki.guildwars.com';

export default class WikiCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'wiki',
            group: 'gw',
            aliases:['gww','guildwarswiki'],
            memberName: 'wiki',
            description: `Queries Guild Wars Wiki for a search term.`,
            details: '',
            examples: ['wiki Duke Barradin'],
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

        // NB: Wiki turns spaces into underscores, but idk if thats needed here
        const enc_search = encodeURIComponent(args.search.toLowerCase());
        const url = `${wiki_website}/index.php?search=${enc_search}`;

        try {
            const response = await axios.get(url);
            let response_url = response.request.res.responseUrl;
            // Find canonical link
            const canonical = /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/.exec(response.data);
            if(canonical) {
                response_url = canonical[1];
            }
            return await searchMessage.edit(response_url);
        } catch(e : any) {
            return await searchMessage.edit([
                `Sorry, something went wrong fetching results from ${url}.`,
                e.toString()
            ]);
        }
    }
}
