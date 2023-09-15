const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('queue')
    .setDescription('Muestra la cola de reproducción.')
    .addIntegerOption(option =>
        option.setName('page')
            .setDescription('Página de la cola de reproducción a mostrar.')
            .setRequired(false));

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var queue = connection.queue;

    if (queue.songs.length == 0) return interaction.followUp({ embeds: [embedMessages.getEmptyQueueMessage()] });
    interaction.followUp({ embeds: [embedMessages.getQueueMessage(queue, page, interaction.user)] });
}

module.exports = {
    data: data,
    execute: execute
}