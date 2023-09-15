const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('clear')
    .setDescription('Elimina todas las canciones de la cola.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var queue = connection.queue;
    queue.songs = [];

    interaction.followUp({ embeds: [embedMessages.getClearMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}