package me.arycer.rosebot.music;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.player.event.AudioEventAdapter;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import com.sedmelluq.discord.lavaplayer.track.AudioTrackEndReason;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

public class TrackScheduler extends AudioEventAdapter {
    private final AudioPlayer player;
    @Getter
    private final BlockingQueue<AudioTrack> queue;

    @Getter @Setter
    private AudioTrack currentTrack;
    @Getter @Setter
    private boolean shuffling = false;
    @Getter @Setter
    private boolean looping = false;

    public TrackScheduler(AudioPlayer audioPlayer) {
        this.player = audioPlayer;
        this.queue = new LinkedBlockingQueue<>();
    }

    public boolean add(AudioTrack track) {
        if (!player.startTrack(track, true)) {
            return queue.offer(track);
        } else {
            return true;
        }
    }

    public void next() {
        if (looping && currentTrack != null) {
            player.startTrack(currentTrack.makeClone(), false);
            return;
        }

        if (shuffling) {
            shuffle();
        }

        currentTrack = queue.poll();
        if (currentTrack == null) {
            player.stopTrack();
            return;
        }

        player.startTrack(currentTrack, false);
    }

    @Override
    public void onTrackEnd(AudioPlayer player, AudioTrack track, AudioTrackEndReason endReason) {
        if (endReason.mayStartNext) {
            next();
        }
    }

    public void shuffle() {
        var queue = this.getQueue();
        var songList = new ArrayList<>(queue.stream().toList());

        queue.clear();

        for (int i = 0; i < songList.size(); i++) {
            var randomIndex = (int) (Math.random() * songList.size());

            if (queue.offer(songList.get(randomIndex))) {
                songList.remove(randomIndex);
            }
        }
    }
}
