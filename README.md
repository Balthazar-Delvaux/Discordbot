# Discord Bot

A very basic bot to stream music from youtube on your server

## Features

[x] Can be used to play music across multiple servers

[x] Storing music playlists on a local SQLite database

[x] Play, Stop and Purge commands

[x] Written in TypeScript, using [Discord.js](https://discord.js.org/#/docs/main/stable/general/welcome) and [Commando](https://discord.js.org/#/docs/commando/master/general/welcome)


## Installation
1. Create a new Discord app on their website
2. rename .env.example to .env and fill the fields
- DISCORD_TOKEN is provided in your discord app 
- DISCORD_PREFIX is the prefix to trigger commands
- DISCORD_OWNER is your ID, enable Developer Mode in your client and you can copy the id when you right click on your name.

3. Install dependencies:

`Node.js 12 or newer is required`

Since it's tough to get `sodium` and `@discordjs/opus` working, there is probably a few extra steps to install them 

### Linux
- `npm install node-gyp -g`
- `apt install libtool-bin`
- `npm install`

### Windows
- `npm install --global --production --vs2015 --add-python-to-path windows-build-tools`
- `npm install`

### Mac
- Install Linux and refer to the Linux section.


If you still have issues you can replace `sodium` by `libsodium-wrappers` and `@discordjs/opus` by `opusscript` but due to their performance they should only be used for development.
