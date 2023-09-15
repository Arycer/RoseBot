const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('shuffle')
    .setDescription('Establece el modo de reproducción aleatorio.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var queue = connection.queue;
    queue.shuffling = !queue.shuffling;

    interaction.followUp({ embeds: [embedMessages.getShuffleMessage(queue.shuffling)] });
}

module.exports = {
    data: data,
    execute: execute
}