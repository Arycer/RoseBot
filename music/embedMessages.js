const { EmbedBuilder } = require('discord.js');

var getNotInVoiceChannelMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "No estás en un canal de voz: 🔇"
        })
        .setColor("#eee70b")
        .setDescription(`Únete a un canal de voz para poder reproducir música.`)

    return embed;
}

var getNotPlayingMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "No se está reproduciendo nada: 🔇"
        })
        .setColor("#eee70b")
        .setDescription(`No se está reproduciendo nada en este momento.`)

    return embed;
}

var getNowPlayingMessage = function(song) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Ahora suena: 🎵"
        })
        .setColor("#eee70b")
        .setDescription(`Añade canciones a la cola con /music play <canción>.`)
        .setFooter({
            text: `Añadida por ${song.requester.tag}`,
            iconURL: song.requester.avatarURL()
        })
        .setTitle(`${song.title} - ${song.duration}`)
        .setURL(song.url)

    return embed;
}

var getAddToQueueMessage = function(song) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Añadida a la cola: 🎵"
        })
        .setColor("#eee70b")
        .setDescription(`Añade canciones a la cola con /music play <canción>.`)
        .setFooter({
            text: `Añadida por ${song.requester.tag}`,
            iconURL: song.requester.avatarURL()
        })
        .setTitle(`${song.title} - ${song.duration}`)
        .setURL(song.url)

    return embed;
}

var getPlaylistAddToQueueMessage = function(songs, title, url) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Añadidas a la cola: 🎵"
        })
        .setColor("#eee70b")
        .setDescription(`Añade canciones a la cola con /music play <canción>.`)
        .setFooter({
            text: `Añadidas por ${songs[0].requester.tag}`,
            iconURL: songs[0].requester.avatarURL()
        })
        .setTitle(`${songs.length} canciones - ${title}`)
        .setURL(url)

    return embed;
}

var getQueueMessage = function(queue, page, requester) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Cola de reproducción: 🎵"
        })
        .setColor("#eee70b")
        .setDescription(`Añade canciones a la cola con /music play <canción>.`)
        .setFooter({
            text: `Solicitado por ${requester.tag}`,
            iconURL: requester.avatarURL()
        })
        .setTitle(`Ahora suena: ${queue.current.title} - ${queue.current.duration}`)
        .setURL(queue.current.url);

    var description = "";
    var start = (page - 1) * 10;
    var end = start + 10;

    for (var i = start; i < queue.songs.length && i < end; i++) {
        var song = queue.songs[i];
        description += `${i + 1}. [${song.title}](${song.url}) - ${song.duration}\n`;
    }

    embed.setDescription(description);

    return embed;
}

var getSkipMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Saltada: ⏭️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha saltado la canción actual.`)

    return embed;
}

var getLoopMessage = function(looping) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Bucle: 🔁"
        })
        .setColor("#eee70b")
        .setDescription(`El bucle ahora está ${looping ? "activado" : "desactivado"}.`)

    return embed;
}

var getShuffleMessage = function(shuffling) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Aleatorio: 🔀"
        })
        .setColor("#eee70b")
        .setDescription(`El modo aleatorio ahora está ${shuffling ? "activado" : "desactivado"}.`)

    return embed;
}

var getLeaveMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Abandonado: 🚪"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha abandonado el canal de voz.`)

    return embed;
}

var getPauseMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Pausado: ⏸️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha pausado la reproducción.`)

    return embed;
}

var getResumeMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Reanudado: ▶️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha reanudado la reproducción.`)

    return embed;
}

var getClearMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Eliminada la cola: 🗑️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha eliminado la cola de reproducción.`)

    return embed;
}

var getRemoveMessage = function(removedSong, requester) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Eliminada de la cola: 🗑️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha eliminado la canción de la cola de reproducción.`)
        .setFooter({
            text: `Eliminada por ${requester.tag}`,
            iconURL: requester.avatarURL()
        })
        .setTitle(`${removedSong.title} - ${removedSong.duration}`)
        .setURL(removedSong.url)

    return embed;
}

var getInvalidIndexMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Índice inválido: ❌"
        })
        .setColor("#eee70b")
        .setDescription(`El índice debe ser un número entre 1 y el número de canciones de la cola de reproducción.`)

    return embed;
}

var getStopMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Detenido: ⏹️"
        })
        .setColor("#eee70b")
        .setDescription(`Se ha detenido la reproducción.`)

    return embed;
}

var getEmptyQueueMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Cola vacía: 🗑️"
        })
        .setColor("#eee70b")
        .setDescription(`La cola de reproducción está vacía.`)

    return embed;
}

var getPlaylistNotFoundSongsMessage = function(songs) {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Algunas canciones no se han encontrado: ❌"
        })
        .setColor("#eee70b");

    var description = "";
    if (songs > 1) {
        description = `No se han encontrado ${songs.length} canciones. Es posible que los vídeos estén eliminados, sean privados o tengan restricciones de edad.`;
    } else {
        description = `No se ha encontrado una canción. Es posible que el vídeo esté eliminado, sea privado o tenga restricciones de edad.`;
    }

    embed.setDescription(description);

    return embed;
}

var getPlaylistNotFoundMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Playlist no encontrada: ❌"
        })
        .setColor("#eee70b")
        .setDescription(`No se ha encontrado la playlist. Es posible la playlist sea privada o que el enlace sea inválido.`)

    return embed;
}

var getSongNotFoundMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Canción no encontrada: ❌"
        })
        .setColor("#eee70b")
        .setDescription(`No se ha encontrado la canción. Es posible que el vídeo esté eliminado, sea privado o tenga restricciones de edad.`)

    return embed;
}

var getEmptyChannelMessage = function() {
    var embed = new EmbedBuilder()
        .setAuthor({
            name: "Me he desconectado: 🚪"
        })
        .setColor("#eee70b")
        .setDescription(`Me he desconectado del canal de voz porque no había nadie en él.`)

    return embed;
}

module.exports = {
    getNotInVoiceChannelMessage: getNotInVoiceChannelMessage,
    getNotPlayingMessage: getNotPlayingMessage,
    getNowPlayingMessage: getNowPlayingMessage,
    getAddToQueueMessage: getAddToQueueMessage,
    getPlaylistAddToQueueMessage: getPlaylistAddToQueueMessage,
    getQueueMessage: getQueueMessage,
    getSkipMessage: getSkipMessage,
    getLoopMessage: getLoopMessage,
    getShuffleMessage: getShuffleMessage,
    getLeaveMessage: getLeaveMessage,
    getPauseMessage: getPauseMessage,
    getResumeMessage: getResumeMessage,
    getClearMessage: getClearMessage,
    getRemoveMessage: getRemoveMessage,
    getInvalidIndexMessage: getInvalidIndexMessage,
    getStopMessage: getStopMessage,
    getEmptyQueueMessage: getEmptyQueueMessage,
    getPlaylistNotFoundSongsMessage: getPlaylistNotFoundSongsMessage,
    getPlaylistNotFoundMessage: getPlaylistNotFoundMessage,
    getSongNotFoundMessage: getSongNotFoundMessage,
    getEmptyChannelMessage: getEmptyChannelMessage
}