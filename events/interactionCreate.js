const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (!interaction.guild) return interaction.deleteReply();

        const cmd = client.commands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({
            content: 'Comando no encontrado.',
            ephemeral: true
        });

        try {
            await interaction.deferReply();
            await cmd.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.followUp({
                content: 'Ha ocurrido un error al ejecutar el comando.',
                ephemeral: true
            });
        }
    }
}