package me.arycer.rosebot.api.event;

import net.dv8tion.jda.api.JDA;

import java.util.ArrayList;
import java.util.List;

public class EventManager {
    private final JDA bot;
    private final List<BotEvent> events = new ArrayList<>();

    public EventManager(JDA bot) {
        this.bot = bot;
    }

    public void registerEvents() {
        for (BotEvent event : events) {
            bot.addEventListener(event);
        }
    }

    public void addEvent(BotEvent event) {
        events.add(event);
    }
}
