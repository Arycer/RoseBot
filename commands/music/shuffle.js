const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('shuffle')
    .setDescription('Establece el modo de reproducción aleatorio.');

var execute = async function(interaction) {
    var voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

    var queue = connection.queue;
    queue.shuffling = !queue.shuffling;

    interaction.followUp({ embeds: [embedMessages.getShuffleMessage(queue.shuffling)] });
}

module.exports = {
    data: data,
    execute: execute
}