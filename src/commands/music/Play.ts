import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import ytdl from "ytdl-core-discord";
import { Music } from '../../dbModels';
import { Song } from "../../interfaces/song";

/**
 * Add a music to the music queue
 * @param song 
 * @param message 
 */
const addMusic = async (song: Song, message: CommandoMessage) => {
    return Music.create({
        guild_id: message.guild.id,
        title: song.title,
        duration: song.duration,
        url: song.url
    });
}

/**
 * Get the music queue for this guild
 * @param guildId 
 */
const getQueue = async (guildId: string): Promise<Song[]> => {
    const res = await Music.findAll({
        where: { guild_id: guildId },
        attributes: [`id`, `title`, `url`, `duration`]
    })
    const queue = res.map((item: any) => item.dataValues)
    return queue;
}

/**
 * Removes the first item in music queue 
 * @param musicId 
 */
const shiftQueue = async (musicId: string) => {
    await Music.destroy({
        where: { id: musicId }
    })
}


module.exports = class MusicPlay extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            description: `Plays a music from a Youtube url or resume playlist`,
            group: `music`,
            memberName: `play`,
            name: `play`,
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [
                {
                    key: `url`,
                    prompt: `Give me a youtube URL`,
                    type: `string`,
                    validate: (url: string) => ytdl.validateURL(url)
                }
            ]
        })
    }

    async run(message: CommandoMessage, { url }: { url: string }) {

        // Message sender needs to be in a voice channel
        if (!message.member?.voice.channel) return message.reply(`You are not in a voice channel`);

        // Get the connection if bot is already playing or join the voice channel
        const connection = this.client.voice?.connections.get(message.guild.id) || await message.member.voice.channel.join();

        // Checks if the bot is playing in another channel
        if (message.member.voice.channelID != connection.channel.id) return message.reply(`I am in another channel!`);


        const getSongInfos = async () => {
            try {
                const res = await ytdl.getBasicInfo(url);
                const song = {
                    title: res.videoDetails.title,
                    duration: res.videoDetails.lengthSeconds,
                    url: res.videoDetails.video_url
                }
                return song;
            } catch (error) {
                throw error;
            }
        }

        const setSong = async () => {
            try {
                const song = await getSongInfos();
                await addMusic(song, message);
                return;
            } catch (error) {
                return message.say(`Video unavailable`);
            }
        }

        await setSong();

        // If the bot is already playing, don't execute play()
        if (!connection.dispatcher) {
            const play = async () => {

                const queue = await getQueue(message.member?.guild.id!);

                if (!queue.length) {
                    return connection.disconnect();
                }

                const dispatcher = connection.play(await ytdl(queue[0].url, { filter: `audioonly` }), { type: "opus" });

                dispatcher.on(`start`, () => {
                    return message.say(`🎶 Now playing \`${queue[0].title}\` (${queue.length} musics in Playlist)`);
                })
                dispatcher.on(`finish`, async () => {
                    await shiftQueue(queue[0].id!);
                    play();
                })
                dispatcher.on(`error`, error => {
                    console.error(error);
                    connection.disconnect();
                    return message.say(`An error occured while playing :(`);
                })
                dispatcher.on("close", async () => {
                    await shiftQueue(queue[0].id!);
                })
            }
            play();
        }
        return null;

    }
}