const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const embedMessages = require('./embedMessages.js');
const { getBasicInfo } = require('ytdl-core');
const Queue = require('./Queue.js');
const Song = require('./Song.js');
const play = require('play-dl');
const ytfps = require('ytfps');
require('dotenv').config();

var getInfo = async function(url) {
    try {
        var info = await getBasicInfo(url);
    } catch (err) {
        return null;
    }

    return info;
}

var getSongTitle = async function(url) {
    var info = await getInfo(url);
    if (info == null) {
        return null;
    }

    return info.videoDetails.title;
}

var getSongDuration = async function(url) {
    var info = await getInfo(url);
    if (info == null) {
        return null;
    }

    var seconds = info.videoDetails.lengthSeconds;
    var hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    seconds = Math.floor(seconds);

    if (hours > 0) {
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    } else {
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }
}

var searchSong = async function(query, requester) {
    var regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g;

    var info = null;
    if (!regex.test(query)) {
        var results = await play.search(query, { limit: 3 });

        for (const result of results) {
            info = await getInfo(result.url);
            if (info != null) {
                break;
            }
        }

        if (info == null) {
            return null;
        }
    } else {
        info = await getInfo(query);
        if (info == null) {
            return null;
        }
    }

    var title = info.videoDetails.title;
    var url = info.videoDetails.video_url;
    var duration = await getSongDuration(url);
    return new Song(title, url, duration, requester);
}

var createResource = async function(song) {
    var audio = await play.stream(song.url);
    return createAudioResource(audio.stream, { inputType: audio.type });
}

var createConnection = async function (interaction) {
    var connection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });

    connection.textChannel = interaction.channel;
    connection.queue = new Queue();

    var player = createAudioPlayer();
    connection.subscribe(player);

    return connection;
}

var wait = async function(client, player, connection) {
    while(player.state.status != AudioPlayerStatus.Idle) {
        if (connection.state.status == 'destroyed') {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        var count = await getUserCount(client, player);
        if (count == 1) {
            await leaveIfEmpty(client, player, connection);
        }
    }
}

var getUserCount = async function(client, player) {
    if (!player.subscribers[0]) {
        return 0;
    }

    var channel_id = player.subscribers[0].connection.packets.state.channel_id;
    var guild_id = player.subscribers[0].connection.packets.state.guild_id;
    var guild = client.guilds.cache.get(guild_id);
    var channel = guild.channels.cache.get(channel_id);
    return channel.members.size;
}

var leaveIfEmpty = async function(client, player, connection) {
    var count = await getUserCount(client, player);
    var timeouts = 0;

    do {
        await new Promise(resolve => setTimeout(resolve, 1000));
        count = await getUserCount(client, player);
        timeouts++;

        if (timeouts >= 60 * 3) {
            await destroy(player, connection);
            await trySend(connection.textChannel, embedMessages.getEmptyChannelMessage());
            return;
        }
    } while(count == 1);
}

var destroy = async function (player, connection) {
    if (connection.queue && connection.queue.songs) {
        connection.queue.songs = [];
        player.stop();
        connection.destroy();
    }
}

var trySend = async function(channel, embed) {
    try {
        await channel.send({ embeds: [embed] });
    } catch (err) {
        console.log(err);
    }
}

var getList = async function(url) {
    try {
        var list = await ytfps(url);
    } catch (err) {
        console.log(err);
        return null;
    }

    return list;
}

var getPlaylistUrls = async function(url) {
    var list = await getList(url);
    if (list == null) {
        return null;
    }
    var videos = list.videos;
    return videos.map(video => video.url);
}

var getPlaylistSongs = async function(url, requester) {
    var urls = await getPlaylistUrls(url);
    if (urls == null) {
        return null;
    }

    var songPromises = urls.map(async (url) => {
        return await searchSong(url, requester);
    });

    return await Promise.all(songPromises);
}

var getPlaylistTitle = async function(url) {
    var list = await ytfps(url);
    return list.title;
}

module.exports = {
    getSongTitle: getSongTitle,
    searchSong: searchSong,
    createResource: createResource,
    createConnection: createConnection,
    wait: wait,
    getUserCount: getUserCount,
    leaveIfEmpty: leaveIfEmpty,
    getPlaylistUrls: getPlaylistUrls,
    getPlaylistSongs: getPlaylistSongs,
    getPlaylistTitle: getPlaylistTitle,
    getInfo: getInfo,
    trySend: trySend,
    destroy: destroy
}