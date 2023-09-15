const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproducción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    connection.destroy();

    interaction.followUp({ embeds: [embedMessages.getStopMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}