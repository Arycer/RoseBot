const { REST, Routes, Events } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Bot iniciado como ${client.user.tag}.`);

        const cmd_dir = join(__dirname, "..", "commands");
        const cmd_files = readdirSync(cmd_dir)
            .filter(file => file.endsWith(".js"));

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        const commands = [];

        cmd_files.forEach(file => {
            const cmd_file = join(cmd_dir, file);
            const cmd = require(cmd_file);

            commands.push(cmd.data.toJSON());
        });

        try {
            console.log(`Actualizando %d interacciones (/).`, commands.length);

            var data = await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            console.log(`%d interacciones (/) actualizadas.`, data.length);
        } catch (error) {
            console.error(error);
        }
    }
}