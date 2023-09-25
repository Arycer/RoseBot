package me.arycer.rosebot.api.event;

import lombok.Setter;
import net.dv8tion.jda.api.events.GenericEvent;
import net.dv8tion.jda.api.hooks.EventListener;
public class BotEvent implements EventListener {
    @Setter
    private Class<? extends GenericEvent> event;

    @Override
    public void onEvent(GenericEvent event) {
        if (!(event.getClass().equals(this.event))) return;

        execute(event);
    }

    public void execute(GenericEvent event) {
    }
}
