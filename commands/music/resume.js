const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('resume')
    .setDescription('Reanuda la canción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    const player = connection.state.subscription?.player;
    player.unpause();

    interaction.followUp({ embeds: [embedMessages.getResumeMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}