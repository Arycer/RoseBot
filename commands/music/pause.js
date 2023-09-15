const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('pause')
    .setDescription('Pausa la canción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    const player = connection.state.subscription?.player;
    player.pause();

    interaction.followUp({ embeds: [embedMessages.getPauseMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}