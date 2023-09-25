package me.arycer.rosebot.api.command;

import lombok.Getter;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.commands.build.CommandData;
import net.dv8tion.jda.api.interactions.commands.build.Commands;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;

import java.util.ArrayList;
import java.util.List;

@Getter
public class BotCommand extends ListenerAdapter {
    private final String name;
    private final String description;
    private final List<OptionData> options = new ArrayList<>();
    private final List<BotCommandGroup> subCommandGroups = new ArrayList<>();
    private final List<BotSubCommand> subCommands = new ArrayList<>();

    public BotCommand(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void addOption(String name, String description, OptionType type, boolean required, boolean autoComplete) {
        options.add(new OptionData(type, name, description, required, autoComplete));
    }

    public void addOption(OptionData option) {
        options.add(option);
    }

    public void addSubCommand(BotSubCommand command) {
        subCommands.add(command);
    }

    public void addCommandGroup(BotCommandGroup commandGroup) {
        subCommandGroups.add(commandGroup);
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        if (!event.getName().equals(name)) return;

        event.deferReply().queue();

        String subCommandGroupName = event.getSubcommandGroup();
        System.out.println(subCommandGroupName);

        if (subCommandGroupName != null) {
            subCommandGroups.stream()
                    .filter(command -> command.getName().equals(subCommandGroupName))
                    .findFirst().ifPresent(subCommandGroup -> {
                        subCommandGroup.onSlashCommandInteraction(event);
                        System.out.println("Subcommand group found!");
                    });

            return;
        }

        String subCommandName = event.getSubcommandName();
        if (subCommandName != null) {
            subCommands.stream()
                    .filter(command -> command.getName().equals(subCommandName))
                    .findFirst().ifPresent(subCommand -> subCommand.execute(event));
        } else {
            execute(event);
        }
    }

    public void execute(SlashCommandInteractionEvent event) {
    }

    public CommandData toCommandData() {
        var mainCommand = Commands.slash(this.name, this.description);

        for (OptionData option : this.options) {
            mainCommand.addOption(option.getType(), option.getName(), option.getDescription(), option.isRequired(), option.isAutoComplete());
        }

        for (BotSubCommand subCommand : this.subCommands) {
            mainCommand.addSubcommands(subCommand.toCommandData());
        }

        for (BotCommandGroup subCommandGroup : this.subCommandGroups) {
            mainCommand.addSubcommandGroups(subCommandGroup.toCommandData());
        }

        return mainCommand;
    }

    @Override
    public String toString() {
        return "BotCommand{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", options=" + options +
                ", subCommands=" + subCommands +
                '}';
    }
}
