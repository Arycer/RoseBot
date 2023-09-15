class Queue {
    constructor() {
        this.playing = false;
        this.looping = false;
        this.shuffling = false;
        this.songs = [];
        this.current = null;
    }

    add(song) {
        this.songs.push(song);
    }

    remove(index) {
        this.songs.splice(index, 1);
    }

    next() {
        if (this.shuffling) {
            this.shuffle();
        }

        if (this.songs.length > 0) {
            this.current = this.songs.shift();
        } else {
            this.current = null;
        }
    }

    clear() {
        this.songs = [];
        this.current = null;
    }

    shuffle() {
        var currentIndex = this.songs.length, randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [this.songs[currentIndex], this.songs[randomIndex]] = [this.songs[randomIndex], this.songs[currentIndex]];
        }
    }
}

module.exports = Queue;