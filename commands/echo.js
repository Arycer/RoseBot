const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Repite un mensaje.')
    .addStringOption(option => option.setName('mensaje').setDescription('Mensaje a repetir').setRequired(true));

module.exports = {
    data: data,
    async execute (interaction) {
        if (!interaction.guild) return interaction.deleteReply();

        // Verificar si el usuario tiene el permiso de gestionar mensajes
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            return interaction.followUp({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
        }

        const message = interaction.options.getString('mensaje');
        interaction.channel.send(message);

        interaction.followUp({ content: 'Mensaje enviado.', ephemeral: true });
        interaction.channel.messages.fetch(interaction.id).then(message => message.delete());
    }
}