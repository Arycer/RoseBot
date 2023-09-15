const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('skip')
    .setDescription('Salta la canción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    const player = connection.state.subscription?.player;
    player.stop();

    interaction.followUp({ embeds: [ embedMessages.getSkipMessage() ] });
}


module.exports = {
    data: data,
    execute: execute
}