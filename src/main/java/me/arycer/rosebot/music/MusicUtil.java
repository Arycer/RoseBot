package me.arycer.rosebot.music;

import com.sedmelluq.discord.lavaplayer.player.AudioLoadResultHandler;
import com.sedmelluq.discord.lavaplayer.tools.FriendlyException;
import com.sedmelluq.discord.lavaplayer.track.AudioPlaylist;
import com.sedmelluq.discord.lavaplayer.track.AudioTrack;
import me.arycer.rosebot.Main;
import me.arycer.rosebot.api.util.Util;
import net.dv8tion.jda.api.entities.Member;
import net.dv8tion.jda.api.entities.User;
import net.dv8tion.jda.api.entities.channel.concrete.VoiceChannel;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.managers.AudioManager;

import java.util.List;

public class MusicUtil {
    public static void loadAndPlay(final SlashCommandInteractionEvent event, final String songUrl) {
        if (event.getGuild() == null) return;

        GuildMusicManager musicManager = Main.getInstance().getGuildAudioPlayer(event.getGuild());
        Main.getInstance().getPlayerManager().loadItemOrdered(musicManager, songUrl, new AudioLoadResultHandler() {
            @Override
            public void trackLoaded(AudioTrack track) {
                Util.followUp(event, String.format("Adding to queue: %s", track.getInfo().title));
                play(event, musicManager, track);
            }

            @Override
            public void playlistLoaded(AudioPlaylist playlist) {
                Util.followUp(event, String.format("Adding to queue: %s", playlist.getName()));
                for (AudioTrack track : playlist.getTracks()) {
                    play(event, musicManager, track);
                }
            }

            @Override
            public void noMatches() {
                Util.followUp(event, String.format("Nothing found by %s", songUrl));
            }

            @Override
            public void loadFailed(FriendlyException exception) {
                Util.followUp(event, String.format("Could not play: %s", exception.getMessage()));
            }
        });
    }

    public static void play(final SlashCommandInteractionEvent event, GuildMusicManager manager, AudioTrack track) {
        if (event.getGuild() == null) return;

        var audioChannel = connectToChannel(event);
        if (audioChannel == null) {
            Util.followUp(event, "You are not connected to any voice channel.");
            return;
        }

        manager.getScheduler().add(track);
    }

    public static VoiceChannel connectToChannel(final SlashCommandInteractionEvent event) {
        if (event.getGuild() == null) return null;

        User user = event.getUser();
        AudioManager audioManager = event.getGuild().getAudioManager();

        for (VoiceChannel voiceChannel : audioManager.getGuild().getVoiceChannels()) {
            List<Long> users = voiceChannel.getMembers().stream().map(Member::getIdLong).toList();
            if (users.contains(user.getIdLong())) {
                audioManager.openAudioConnection(voiceChannel);
                return voiceChannel;
            }
        }

        return null;
    }

    public static void skipTrack(final SlashCommandInteractionEvent event) {
        if (event.getGuild() == null) return;

        GuildMusicManager manager = Main.getInstance().getGuildAudioPlayer(event.getGuild());
        manager.getScheduler().next();

        Util.followUp(event, "Skipped to next track.");
    }
}
