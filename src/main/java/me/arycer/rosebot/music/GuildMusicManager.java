package me.arycer.rosebot.music;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayer;
import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager;
import lombok.Getter;
import net.dv8tion.jda.api.audio.AudioSendHandler;

@Getter
public class GuildMusicManager {
    private final AudioPlayer player;
    private final TrackScheduler scheduler;

    public GuildMusicManager(AudioPlayerManager manager) {
         player = manager.createPlayer();
         scheduler = new TrackScheduler(player);
         player.addListener(scheduler);
    }

    public AudioSendHandler getSendHandler() {
        return new AudioPlayerSendHandler(player);
    }
}
