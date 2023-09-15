const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('clear')
    .setDescription('Elimina todas las canciones de la cola.');

var execute = async function(interaction) {
    var voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

    var queue = connection.queue;
    queue.songs = [];

    interaction.followUp({ embeds: [embedMessages.getClearMessage()] });
}

module.exports = {
    data: data,
    execute: execute
}