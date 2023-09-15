const { SlashCommandSubcommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de reproducción.');

var execute = async function(interaction) {
    var voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

    var queue = connection.queue;
    if (!queue.playing) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

    if (queue.songs.length == 0) return interaction.followUp({ embeds: [embedMessages.getEmptyQueueMessage()] });
    interaction.followUp({ embeds: [embedMessages.getQueueMessage(queue, interaction.user)] });
}

module.exports = {
    data: data,
    execute: execute
}