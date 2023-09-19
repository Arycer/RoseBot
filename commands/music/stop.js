const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');
const util = require('../../music/util.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('stop')
    .setDescription('Detiene la reproducción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var player = connection.state.subscription?.player;

    await util.destroy(player, connection);
    interaction.followUp({ embeds: [embedMessages.getStopMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}