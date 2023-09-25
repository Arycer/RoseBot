package me.arycer.rosebot;

import com.sedmelluq.discord.lavaplayer.player.AudioPlayerManager;
import com.sedmelluq.discord.lavaplayer.player.DefaultAudioPlayerManager;
import com.sedmelluq.discord.lavaplayer.source.AudioSourceManagers;
import lombok.Getter;
import me.arycer.rosebot.api.DiscordBot;
import me.arycer.rosebot.command.PlayCommand;
import me.arycer.rosebot.music.GuildMusicManager;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.entities.Guild;
import net.dv8tion.jda.api.requests.GatewayIntent;

import java.util.HashMap;

@Getter
public class Main {
    private static Main INSTANCE;
    public static void main(String[] args) {
        new Main();

        DiscordBot bot = DiscordBot.fromEnv(
                "TOKEN",
                Activity.listening("arycer.me"),
                GatewayIntent.GUILD_MEMBERS,
                GatewayIntent.GUILD_MESSAGES,
                GatewayIntent.GUILD_VOICE_STATES
        );

        bot.addCommand(new PlayCommand());

        bot.init();
    }

    private final AudioPlayerManager playerManager;
    private final HashMap<Long, GuildMusicManager> musicManagers;

    private Main() {
        INSTANCE = this;

        this.musicManagers = new HashMap<>();
        this.playerManager = new DefaultAudioPlayerManager();

        AudioSourceManagers.registerRemoteSources(playerManager);
        AudioSourceManagers.registerLocalSource(playerManager);
    }

    public synchronized GuildMusicManager getGuildAudioPlayer(Guild guild) {
        long guildId = Long.parseLong(guild.getId());
        GuildMusicManager musicManager = musicManagers.get(guildId);

        if (musicManager == null) {
            musicManager = new GuildMusicManager(playerManager);
            musicManagers.put(guildId, musicManager);
        }

        guild.getAudioManager().setSendingHandler(musicManager.getSendHandler());
        return musicManager;
    }

    public static Main getInstance() {
        return INSTANCE;
    }
}
