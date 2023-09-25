package me.arycer.rosebot.api.command;

import lombok.Getter;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.build.SubcommandGroupData;

import java.util.ArrayList;
import java.util.List;

@Getter
public class BotCommandGroup extends ListenerAdapter {
    private final String name;
    private final String description;
    private final List<BotSubCommand> subCommands = new ArrayList<>();

    public BotCommandGroup(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void addSubCommand(BotSubCommand command) {
        subCommands.add(command);
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        String subCommandGroupName = event.getSubcommandGroup();
        if (subCommandGroupName == null || !subCommandGroupName.equals(name)) return;

        String subCommandName = event.getSubcommandName();
        if (subCommandName == null) return;

        subCommands.stream()
                .filter(command -> command.getName().equals(subCommandName))
                .findFirst().ifPresent(subCommand -> subCommand.execute(event));
    }

    public void execute(SlashCommandInteractionEvent event) {
    }

    public SubcommandGroupData toCommandData() {
        var mainCommand = new SubcommandGroupData(this.name, this.description);

        for (BotSubCommand subCommand : this.subCommands) {
            mainCommand.addSubcommands(subCommand.toCommandData());
        }

        return mainCommand;
    }
    @Override
    public String toString() {
        return "BotCommandGroup{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", subCommands=" + subCommands +
                '}';
    }
}
