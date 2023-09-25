package me.arycer.rosebot.api.command;

import lombok.Getter;
import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;
import net.dv8tion.jda.api.hooks.ListenerAdapter;
import net.dv8tion.jda.api.interactions.commands.OptionType;
import net.dv8tion.jda.api.interactions.commands.build.OptionData;
import net.dv8tion.jda.api.interactions.commands.build.SubcommandData;

import java.util.ArrayList;
import java.util.List;

@Getter
public class BotSubCommand extends ListenerAdapter {
    private final String name;
    private final String description;
    private final List<OptionData> options = new ArrayList<>();

    public BotSubCommand(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void addOption(String name, String description, OptionType type, boolean required, boolean autoComplete) {
        options.add(new OptionData(type, name, description, required, autoComplete));
    }

    public void addOption(OptionData option) {
        options.add(option);
    }

    @Override
    public void onSlashCommandInteraction(SlashCommandInteractionEvent event) {
        if (!event.getName().equals(name)) return;

        execute(event);
    }

    public void execute(SlashCommandInteractionEvent event) {
    }

    public SubcommandData toCommandData() {
        var mainCommand = new SubcommandData(this.name, this.description);

        for (OptionData option : this.options) {
            mainCommand.addOption(option.getType(), option.getName(), option.getDescription(), option.isRequired(), option.isAutoComplete());
        }

        return mainCommand;
    }
    @Override
    public String toString() {
        return "BotSubCommand{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", options=" + options +
                '}';
    }
}
