const { Client, Collection, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.User,
        Partials.Reaction
    ],
    presence: {
        activities: [{
            name: "arycer.me",
            type: ActivityType.Listening
        }],
        status: "online"
    }
});

client.commands = new Collection();

/*
* Command registration
*/
const cmd_dir = join(__dirname, "commands");
const cmd_files = readdirSync(cmd_dir)
    .filter(file => file.endsWith(".js"));

cmd_files.forEach(file => {
    const cmd_file = join(cmd_dir, file);
    const cmd = require(cmd_file);
    client.commands.set(cmd.data.name, cmd);
});

/*
* Event registration
*/
const evt_dir = join(__dirname, "events");
const evt_files = readdirSync(evt_dir)
    .filter(file => file.endsWith(".js"));

evt_files.forEach(file => {
    const evt_file = join(evt_dir, file);
    const evt = require(evt_file);

    evt.once ? 
        client.once(evt.name, (...args) => evt.execute(...args, client)) :
        client.on(evt.name, (...args) => evt.execute(...args, client));
});

client.login(process.env.TOKEN);