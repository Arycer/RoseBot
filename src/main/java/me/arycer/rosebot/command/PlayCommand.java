package me.arycer.rosebot.command;

import me.arycer.rosebot.api.command.BotCommand;
import me.arycer.rosebot.music.MusicUtil;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.interactions.commands.OptionType;

public class PlayCommand extends BotCommand {
    public PlayCommand() {
        super("play", "Play a song");
        this.addOption("song", "Título o URL de la canción", OptionType.STRING, true, false);
        this.addOption("next", "Reproducir la canción después de la actual", OptionType.BOOLEAN, false, false);
    }

    @Override
    public void execute(SlashCommandInteractionEvent event) {
        var song = event.getOption("song");
        var next = event.getOption("next");

        if (song == null) return;

        MusicUtil.loadAndPlay(event, song.getAsString());
    }
}
