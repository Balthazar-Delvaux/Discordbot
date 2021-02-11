import { Command, CommandoClient } from "discord.js-commando";

module.exports = class Beep extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: `beep`,
            group: `other`,
            memberName: `beep`,
            description: `Beep Boop`,
        });
    }

    run(message: { say: (arg0: string) => any; }) {
        return message.say('Boop :robot:')
    }
}