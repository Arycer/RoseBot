const { createAudioResource, joinVoiceChannel, createAudioPlayer, AudioPlayerStatus } = require('@discordjs/voice');
const { getBasicInfo } = require('ytdl-core');
const Queue = require('./Queue.js');
const Song = require('./Song.js');
const play = require('play-dl');
const ytfps = require('ytfps');

var getSongTitle = async function(url) {
    var info = await getBasicInfo(url);
    return info.videoDetails.title;
}

var getSongDuration = async function(url) {
    var info = await getBasicInfo(url);
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

    if (regex.test(query)) {
        var title = await getSongTitle(query);
        var duration = await getSongDuration(query);
        return new Song(title, query, duration, requester);
    } else {
        var results = await play.search(query, { limit: 1 });
        var song = results[0];
        var duration = await getSongDuration(song.url);
        return new Song(song.title, song.url, duration, requester);
    }
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

    connection.queue = new Queue();

    var player = createAudioPlayer();
    connection.subscribe(player);

    return connection;
}

var wait = async function(client, player) {
    while (player.state.status == AudioPlayerStatus.Buffering) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    while(player.state.status != AudioPlayerStatus.Idle) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        var count = await getUserCount(client, player);
        if (count == 1) {
            await leaveIfEmpty(client, player);
        }
    }
}

var getUserCount = async function(client, player) {
    var channel_id = player.subscribers[0].connection.packets.state.channel_id;
    var guild_id = player.subscribers[0].connection.packets.state.guild_id;
    var guild = client.guilds.cache.get(guild_id);
    var channel = guild.channels.cache.get(channel_id);
    return channel.members.size;
}

var leaveIfEmpty = async function(client, player) {
    if (player.state.status == AudioPlayerStatus.Idle) {
        player.stop();
        return;
    }

    var timeouts = 0;
    while(player.state.status == AudioPlayerStatus.Playing) {
        var count = await getUserCount(client, player);

        if (count == 1) {
            timeouts++;
            if (timeouts >= 60 * 5) {
                player.stop();
                break;
            }
        } else {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
    
    return;
}

var getPlaylistUrls = async function(url) {
    var list = await ytfps(url);
    var videos = list.videos;
    return videos.map(video => video.url);
}

var getPlaylistSongs = async function(url, requester) {
    var urls = await getPlaylistUrls(url);
    var songs = [];
    for (var i = 0; i < urls.length; i++) {
        var song = await searchSong(urls[i], requester);
        songs.push(song);
    }
    return songs;
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
    getPlaylistTitle: getPlaylistTitle
}