const { SlashCommandSubcommandBuilder, EmbedBuilder, SlashCommandSubcommandGroupBuilder } = require('discord.js');
const { getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandGroupBuilder()
    .setName('shuffle')
    .setDescription('Establece el modo de reproducción aleatorio.');

const modeCommand = new SlashCommandSubcommandBuilder()
    .setName('mode')
    .setDescription('Alterna entre los modos de reproducción aleatoria.');

const queueCommand = new SlashCommandSubcommandBuilder()
    .setName('queue')
    .setDescription('Mezcla la cola de reproducción actual.');

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);

    if (interaction.options.getSubcommand() == 'mode') {
        return await modeExecute(interaction, connection);
    } else if (interaction.options.getSubcommand() == 'queue') {
        return await queueExecute(interaction, connection);
    }
}

var modeExecute = async function(interaction, connection) {
    var queue = connection.queue;
    queue.shuffling = !queue.shuffling;
    interaction.followUp({ embeds: [embedMessages.getShuffleModeMessage(queue.shuffling)] });
}

var queueExecute = async function(interaction, connection) {
    var queue = connection.queue;
    queue.shuffle();

    interaction.followUp({ embeds: [embedMessages.getShuffleQueueMessage(queue.shuffleMode)] });
}

module.exports = {
    group: true,
    data: data.addSubcommand(modeCommand).addSubcommand(queueCommand),
    execute: execute
}