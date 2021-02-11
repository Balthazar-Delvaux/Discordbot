import { Command, CommandoClient, CommandoMessage } from "discord.js-commando"
import { Music } from "../../dbModels"

/**
 * Removes all musics of a guild
 * @param guildId 
 */
const purgeQueue = async (guildId: string) => {
    await Music.destroy({
        where: { guild_id: guildId }
    })
}

module.exports = class MusicPurge extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            description: `Purges the playlist`,
            group: `music`,
            memberName: `purge`,
            name: `purge`,
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            }
        })
    }

    async run(message: CommandoMessage) {
        // Message sender needs to be in a voice channel
        if (!message.member?.voice.channel) return message.reply(`You are not in a voice channel`);

        // Get the connection if there is one
        const connection = this.client.voice?.connections.get(message.guild.id) || false

        if (!connection) return message.say(`I am not playing!`);

        // Checks if the bot is playing in another channel
        if (message.member.voice.channelID != connection.channel.id) return message.reply(`I am in another channel!`);

        await purgeQueue(message.member.guild.id)
        connection.disconnect();
        return message.say(`🚮 Playlist purged`)
    }
}