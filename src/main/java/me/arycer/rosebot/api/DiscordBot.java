package me.arycer.rosebot.api;

import lombok.Getter;
import me.arycer.rosebot.api.command.BotCommand;
import me.arycer.rosebot.api.command.CommandManager;
import me.arycer.rosebot.api.event.BotEvent;
import me.arycer.rosebot.api.event.EventManager;
import net.dv8tion.jda.api.JDA;
import net.dv8tion.jda.api.JDABuilder;
import net.dv8tion.jda.api.entities.Activity;
import net.dv8tion.jda.api.requests.GatewayIntent;

import java.util.Arrays;

public class DiscordBot {
    @Getter
    private final DiscordBot INSTANCE;
    @Getter
    private final JDA bot;

    private final CommandManager commandManager;
    private final EventManager eventManager;

    public DiscordBot(String token, Activity activity, GatewayIntent... intents) {
        INSTANCE = this;
        try {
            bot = JDABuilder.createDefault(token, Arrays.asList(intents)).setActivity(activity).build();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        commandManager = new CommandManager(bot);
        eventManager = new EventManager(bot);
    }

    public DiscordBot(String token, GatewayIntent... intents) {
        this(token, null, intents);
    }

    public void addCommand(BotCommand command) {
        commandManager.addCommand(command);
    }

    public void addEvent(BotEvent event) {
        eventManager.addEvent(event);
    }

    public void init() {
        commandManager.registerCommands();
        eventManager.registerEvents();

        log(String.format("Initialized RoseCore with user %s!", bot.getSelfUser().getName()));
    }

    public void log(String message) {
        System.out.println("[RoseCore] " + message);
    }

    public static DiscordBot fromEnv(String envName, Activity activity, GatewayIntent... intents) throws RuntimeException {
        final String TOKEN = System.getenv(envName);
        if (TOKEN == null) {
            throw new RuntimeException("Token not found in environment variable " + envName);
        }

        return new DiscordBot(TOKEN, activity, intents);
    }

    public static DiscordBot fromEnv(String envName, GatewayIntent... intents) throws RuntimeException {
        return fromEnv(envName, null, intents);
    }
}
