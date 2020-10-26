import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Materials } from '../../lib/materials.js';

const axios = require('axios');

const trade_website = 'https://kamadan.gwtoolbox.com';
const max_results = 10;

export default class MaterialsCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'materials',
            aliases: ['mats'],
            group: 'gw',
            memberName: 'mats',
            description: 'Queries '+trade_website+' for current material trader prices.',
            details: '',
            examples: ['mats']
        });
    }

    async run(message: CommandoMessage) {
      let ongoing_message : any = await message.say(`Fetching current material prices, just a sec...`);
      let json : any = false;
      try {
        json = await axios.get(trade_website+'/trader_quotes');
        json = (json && json.data ? json.data : false);
      } catch (error) {
        console.error(error);
      }
      if(typeof json == 'string')
        try { json = JSON.parse(json); } catch(e) {};
      if(!json || !json.buy)
        return ongoing_message.edit(`Sorry, something went wrong fetching results from ${trade_website}`);
      
      let abbrPrice = function(price,dp) {
        let as_k = 0;
        if(price > 999) {
          as_k = 1;
          price /= 1000;
        }
        if(price % 1 === 0)
            dp = 0;
        return price.toFixed(dp)+(as_k ? "k" : "g");
      }
      
      let get_row = function(key : string, val : any) {
        let item = Materials.getItem(key);
        if(!item)
          return null;
        return `${item.name}: ${abbrPrice(val.p,2)}`;
      };
      
      let results : string[] = [];
      for(var i in json.buy) {
        var got = get_row(i,json.buy[i]);
        if(got)
          results.push(got);
      }
      
      let message_body = [
        `Latest trader prices from ${trade_website}`,
        '>>> ' + `${results.join('\n')}`
      ];
      return ongoing_message.edit(message_body);
    }
}
