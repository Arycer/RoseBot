const { SlashCommandBuilder } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const embedMessages = require('../music/embedMessages.js');

const data = new SlashCommandBuilder()
    .setName('music')
    .setDescription('Comandos de música.');

const cmd_dir = join(__dirname, "music");
const cmd_files = readdirSync(cmd_dir)
    .filter(file => file.endsWith(".js"));

cmd_files.forEach(file => {
    const cmd_file = join(cmd_dir, file);
    const cmd = require(cmd_file);
    data.addSubcommand(cmd.data);
});

module.exports = {
    data: data,
    async execute (interaction) {
        if (!interaction.guild) return interaction.deleteReply();

        var voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

        if (!interaction.options.getSubcommand() == 'play') {
            var connection = interaction.client.voice.connections.get(interaction.guildId);
            if (!connection) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });

            var queue = connection.queue;
            if (!queue.playing) return interaction.followUp({ embeds: [embedMessages.getNotPlayingMessage()] });
        }

        for (const cmd_file of cmd_files) {
            const cmd = require(join(cmd_dir, cmd_file));
            if (cmd.data.name == interaction.options.getSubcommand()) {
                return cmd.execute(interaction);
            }
        }
    }
}