package me.arycer.rosebot.api.util;

import net.dv8tion.jda.api.events.interaction.command.SlashCommandInteractionEvent;

public class Util {
    public static void followUp(SlashCommandInteractionEvent event, String message) {
        event.getHook().sendMessage(message).queue();
    }
}
