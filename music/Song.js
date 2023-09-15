class Song {
    constructor(title, url, duration, requester) {
        this.title = title;
        this.url = url;
        this.requester = requester;
        this.duration = duration;
    }
}

module.exports = Song;