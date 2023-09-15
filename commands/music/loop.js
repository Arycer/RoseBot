const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('loop')
    .setDescription('Establece el modo de reproducción en bucle.');

var execute = async function(interaction) {
    var voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

    var queue = connection.queue;
    queue.looping = !queue.looping;

    interaction.followUp({ embeds: [embedMessages.getLoopMessage(queue.looping)] });
}

module.exports = {
    data: data,
    execute: execute
}