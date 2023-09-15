const { SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js');
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
    var voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.followUp({ embeds: [embedMessages.getNotInVoiceChannelMessage()] });

    var connection = getVoiceConnection(interaction.guildId);
    if (!connection) {
        connection = await utils.createConnection(interaction);
    }
    
    var player = connection.state.subscription.player;
    var queue = connection.queue;

    var query = interaction.options.getString('query');
    if (query.includes('list=')) {
        var playlist = await utils.getPlaylistSongs(query, interaction.user);
        var title = await utils.getPlaylistTitle(query);
        playlist.forEach(song => queue.add(song));
        interaction.followUp({ embeds: [embedMessages.getPlaylistAddToQueueMessage(queue.songs, title, query)] });
    } else {
        var song = await utils.searchSong(query, interaction.user);
        queue.add(song);
    }

    if (queue.playing) {
        return query.includes('list=') ?
            interaction.followUp({ embeds: [embedMessages.getPlaylistAddToQueueMessage(queue.songs, title, query)] }) :
            interaction.followUp({ embeds: [embedMessages.getAddToQueueMessage(song)] });
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
