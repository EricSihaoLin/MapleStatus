## Maple Server Status

This is a simple discord bot that scans the Global MapleStory Servers for their status.

This project is derived from [mgerb's ServerStatus](https://github.com/mgerb/ServerStatus) to make it exclusive to MapleStory and using the Discord.js library

This bot will send a chat notification when the status of a server changes (goes online or offline).

Honestly, this bot is so poorly coded that so many improvements could be made.

## Compiling from source

- CHANGE config.json.template to config.json, fill in the required values
- npm install
- node app.js

### How to get the bot token
https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token

### How to get your room ID

To get IDs, turn on Developer Mode in the Discord client (User Settings -> Appearance) and then right-click your name/icon anywhere in the client and select Copy ID.

<img src="https://camo.githubusercontent.com/9f759ec8b45a6e9dd2242bc64c82897c74f84a25/687474703a2f2f692e696d6775722e636f6d2f47684b70424d512e676966"/>

## Commands

```
!maplestatus - List current server status
!msinfo - List bot connection information
!mshelp - Display a command panel
```
