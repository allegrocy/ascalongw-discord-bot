import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
const axios = require('axios');
require('../../lib/Date.class.js');


const trade_website = 'https://kamadan.gwtoolbox.com';
const max_results = 10;

export default class PricecheckCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'pricecheck',
            aliases: ['pc'],
            group: 'gw',
            memberName: 'pc',
            description: 'Queries '+trade_website+' for trade results.',
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

    async run(message: CommandoMessage, args: any) {
      let ongoing_message : any = await message.say(`Searching for **${args.search}**, just a sec...`);
      let json : any = false;
      let enc_search = encodeURIComponent(args.search);
      try {
        json = await axios.get(trade_website+'/s/'+enc_search);
        json = (json && json.data ? json.data : false);
      } catch (error) {
        console.error(error);
      }
      if(typeof json == 'string')
        try { json = JSON.parse(json); } catch(e) {};
      if(!json)
        return ongoing_message.edit(`Sorry, something went wrong fetching results from ${trade_website}`);
      if(!Array.isArray(json) || !json.length)
        return ongoing_message.edit(`No results found for **${args.search}**`);

      let result_row = function(res : any) {
        let sender = `${res.s.padStart(20,' ')}, ${(new Date(res.t)).relativeTime()}:`.padEnd(38,' ');
        return ` ${sender} ${res.m}`; 
      };
      
      let results : string[] = [];
      for(var i=0;i < json.length && i < max_results;i++) {
        results.push(result_row(json[i]));
      }
      
      let more_results: string[] = [];
      for(var i = results.length; i < json.length;i++) {
        more_results.push(result_row(json[i]));
      }
      
      let message_body = [
        `Latest ${results['length']} results for **${args.search}** from ${trade_website}/search/${enc_search}`,
        '```' + `${results.join('\n')}` + '```'
      ];
      return ongoing_message.edit(message_body);
    }
}
