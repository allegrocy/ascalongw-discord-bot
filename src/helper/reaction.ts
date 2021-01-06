import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';

export function addUncachedMessageReactionHandler(client: CommandoClient) {
    client.on('raw', async (packet: any) => {
        if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
        const channel = client.channels.resolve(packet.d.channel_id);
        if (!channel) return;
        if (!(channel instanceof TextChannel)) return;
        if (channel.messages.resolve(packet.d.message_id)) return;
        const message = await channel.messages.fetch(packet.d.message_id);
        if (!message) return;

        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.resolve(emoji);
        if (!reaction) return;
        let user = client.users.resolve(packet.d.user_id);
        if (!user) {
            user = await client.users.fetch(packet.d.user_id);
            reaction.users.add(user);
        }

        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, user);
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, user);
        }
    });
}
