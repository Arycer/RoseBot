const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Elimina una canción de la cola.')
    .addIntegerOption(option => option.setName('index').setDescription('El índice de la canción a eliminar.').setRequired(true));

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    var queue = connection.queue;
    var index = interaction.options.getInteger('index') - 1;
    if (index < 0 || index >= queue.songs.length) return interaction.followUp({ embeds: [embedMessages.getInvalidIndexMessage()] });

    var removedSong = queue.songs.splice(index, 1)[0];

    interaction.followUp({ embeds: [embedMessages.getRemoveMessage(removedSong, interaction.user)] });
}

module.exports = {
    data: data,
    execute: execute
}