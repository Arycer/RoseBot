const { SlashCommandSubcommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const utils = require('../../music/util.js');
const embedMessages = require('../../music/embedMessages.js');

const data = new SlashCommandSubcommandBuilder()
    .setName('play')
    .setDescription('Reproduce una canción.')
    .addStringOption(option => 
        option.setName('query')
            .setDescription('Canción o playlist de YouTube a reproducir.')
            .setRequired(true));

var execute = async function(interaction) {
    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) {
        connection = await utils.createConnection(interaction);
    }
    
    var player = connection.state.subscription.player;
    var queue = connection.queue;

    var query = interaction.options.getString('query');
    if (query.includes('list=')) {
        var playlist = await utils.getPlaylistSongs(query, interaction.user);
        if (playlist == null) {
            var msg = embedMessages.getPlaylistNotFoundMessage();
            return interaction.followUp({ embeds: [msg] });
        } if (playlist.includes(null)) {
            var notFoundSongs = playlist.filter(song => song == null);
            var msg = embedMessages.getPlaylistNotFoundSongsMessage(notFoundSongs.length);
            interaction.followUp({ embeds: [msg] });

            playlist = playlist.filter(song => song != null);
        }

        var title = await utils.getPlaylistTitle(query);
        playlist.forEach(song => queue.add(song));
        interaction.followUp({ embeds: [embedMessages.getPlaylistAddToQueueMessage(playlist, title, query)] });

        if (queue.playing) {
            return;
        }
    } else {
        var song = await utils.searchSong(query, interaction.user);
        if (song == null) {
            var msg = embedMessages.getSongNotFoundMessage();
            return interaction.followUp({ embeds: [msg] });
        }

        queue.add(song);
    }

    if (queue.playing && !query.includes('list=')) {
        return interaction.followUp({ embeds: [embedMessages.getAddToQueueMessage(song)] });
    } else {
        do {
            if (!queue.looping || !queue.current) {
                queue.next();
            }

            var song = queue.current;
            var resource = await utils.createResource(song);

            player.play(resource);

            var msg = embedMessages.getNowPlayingMessage(song);
            queue.playing ? 
                interaction.channel.send({ embeds: [msg] }) : 
                interaction.followUp({ embeds: [msg] }) && (queue.playing = true);

            await utils.wait(interaction.client, player);
        } while (queue.looping || queue.songs.length > 0);
    }
}

module.exports = {
    data: data,
    execute: execute
}
