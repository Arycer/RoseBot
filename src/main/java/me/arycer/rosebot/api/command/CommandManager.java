package me.arycer.rosebot.api.command;

import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.interactions.commands.build.CommandData;

import java.util.ArrayList;
import java.util.List;

public class CommandManager {
    private final JDA bot;
    private final List<BotCommand> commands = new ArrayList<>();

    public CommandManager(JDA bot) {
        this.bot = bot;
    }

    public void registerCommands() {
        bot.updateCommands().addCommands(
                commands.stream().map(BotCommand::toCommandData).toArray(CommandData[]::new)
        ).queue();

        for (BotCommand command : commands) {
            bot.addEventListener(command);
        }
    }

    public void addCommand(BotCommand command) {
        commands.add(command);
    }
}
