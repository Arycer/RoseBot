const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('loop')
    .setDescription('Establece el modo de reproducción en bucle.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var queue = connection.queue;
    queue.looping = !queue.looping;

    interaction.followUp({ embeds: [embedMessages.getLoopMessage(queue.looping)] });
}

module.exports = {
    data: data,
    execute: execute
}