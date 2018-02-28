const Discord = require("discord.js");
const portscanner = require('portscanner');
const bot = new Discord.Client();

//Global status
var login1 = false;
var login1Delay = 0;
var login1Changed = new Date();

var login2 = false;
var login2Delay = 0;
var login2Changed = new Date();

var login3 = false;
var login3Delay = 0;
var login3Changed = new Date();

var overall = false;
var overallChanged = new Date();

var initial = true;
var lastCheck;

const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

bot.on("ready", () => {
  console.log(`MapleStatus started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
  bot.user.setActivity(`Usage: !maplestatus`);
});

bot.on("guildCreate", server => {
  console.log(`MapleStatus joined joined: ${server.name} (id: ${server.id}). This guild has ${server.memberCount} members!`);
});

bot.on("guildDelete", server => {
  console.log(`MapleStatus been deleted from: ${server.name} (id: ${server.id})`);
});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Let's go with a few common example commands! Feel free to delete or change those.

  if(command === "maplestatus") {
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: "Maple Status Bot",
          icon_url: bot.user.avatarURL
        },
        title: "GMS Server Status",
        fields: [{
            name: "Login Server 1",
            value: login1 ? `<:white_check_mark:418194250694393857> Currently online (${login1Delay} ms)` : "<:x:418196366280622090> Currently offline (No response in 10 seconds)"
          },
          {
            name: "Login Server 2",
            value: login2 ? `<:white_check_mark:418194250694393857> Currently online (${login2Delay} ms)` : "<:x:418196366280622090> Currently offline (No response in 10 seconds)"
          },
          {
            name: "Login Server 3",
            value: login3 ? `<:white_check_mark:418194250694393857> Currently online (${login3Delay} ms)` : "<:x:418196366280622090> Currently offline (No response in 10 seconds)"
          },
        ],
        timestamp: lastCheck,
        footer: {
          icon_url: bot.user.avatarURL,
          text: "Last check at "
        }
      }
    });
  }

  if(command === "msinfo") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Retrieving connection information...");
    m.edit({embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "MapleStatus Bot Info",
        description: "Result",
        fields: [{
            name: "Server latency",
            value: `${m.createdTimestamp - message.createdTimestamp}ms`
          },
          {
            name: "Discord API latency",
            value: `${Math.round(bot.ping)}ms`
          },
          {
            name: "Bot Author",
            value: "This bot is made by MainlandHero#0001"
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "MapleStatus"
        }
      }
    })
  }

  if(command === "mshelp") {
    message.channel.send({embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "MapleStatus Bot Commands",
        description: "Current commands:\n!maplestatus - Current MapleStory status\n!msinfo - Server connection info\n!mshelp - Show this panel",
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "MapleStatus"
        }
      }
    })
  }
});

function cronCheck() {
  lastCheck = new Date();
  portscanner.checkPortStatus(8484, '8.31.99.141', 10000, function(error, status) {
    if (status === 'open') {
      if(!login1){
        login1Changed = new Date();
      }
      login1 = true;
      login1Delay = new Date() - lastCheck;
    } else {
      if(login1){
        login1Changed = new Date();
      }
      login1 = false;
      login1Delay = -1;
    }
  });
  portscanner.checkPortStatus(8484, '8.31.99.142', 10000, function(error, status) {
    if (status === 'open') {
      if(!login2){
        login2Changed = new Date();
      }
      login2 = true;
      login2Delay = new Date() - lastCheck;
    } else {
      if(login2){
        login2Changed = new Date();
      }
      login2 = false;
      login2Delay = -1;
    }
  });
  portscanner.checkPortStatus(8484, '8.31.99.143', 10000, function(error, status) {
    if (status === 'open') {
      if(!login3){
        login3Changed = new Date();
      }
      login3 = true;
      login3Delay = new Date() - lastCheck;
    } else {
      if(login3){
        login3Changed = new Date();
      }
      login3 = false;
      login3Delay = -1;
    }
  });
  checkAnnounce();
  setTimeout(cronCheck, 30000);
}

function checkAnnounce() {
  if(!initial && (login1 == login2 && login2 == login3) && (login1 && login2 && login3) != overall){
    sendAnnouncement();
    overall = login1;
    overallChanged = new Date();
  } else if(initial){
    initial = false;
  }
}

function sendAnnouncement() {
  if(!config.room.trim()){
    console.log("No room ID specified, skipping announcement");
    return;
  }

  let ch = bot.channels.get(config.room.trim());
  if (login1 && login2 && login3){
    ch.send({embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "Maple Status Bot",
        description: `<:white_check_mark:418194250694393857> All GMS MapleStory Login Servers are ONLINE!`,
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "MapleStatus"
        }
      }
    });
  } else if (!login1 && !login2 && !login3) {
    ch.send({embed: {
        color: 3447003,
        author: {
          name: bot.user.username,
          icon_url: bot.user.avatarURL
        },
        title: "Maple Status Bot",
        description: `<:x:418196366280622090> All GMS MapleStory Login Servers are OFFLINE!`,
        timestamp: new Date(),
        footer: {
          icon_url: bot.user.avatarURL,
          text: "MapleStatus"
        }
      }
    });
  }
}

bot.login(config.token);
cronCheck();
