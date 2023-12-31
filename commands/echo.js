const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repite un mensaje.')
    .addStringOption(option => option.setName('mensaje').setDescription('Mensaje a repetir').setRequired(true));

module.exports = {
    data: data,
    async execute (interaction) {
        if (!interaction.guild) return interaction.deleteReply();

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.followUp({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
        }

        const message = interaction.options.getString('mensaje');

        // introduce a new line every \n
        const messageArray = message.split('\n');
        for (let i = 0; i < messageArray.length; i++) {
            interaction.channel.send(messageArray[i]);
        }

        await interaction.deleteReply();
    }
}