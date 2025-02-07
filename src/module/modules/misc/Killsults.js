import Module from "../../module";
import hooks from "../../../hooks";
import gameUtils from "../../../utils/gameUtils";

const insults = [
    "Did :user: pay for that loss?",
    "Are you afraid of me",
    "Did :user: forget to left click?",
    ":user: takes up 2 seats on the bus",
    "It is impossible to miss :user: with their man bo.obs",
    "Come on :user:, report me to the obese staff",
    "No wonder :user: dropped out of college",
    "Here's your ticket to spectator",
    ":user: became Transgender just to join the 50% a day later",
    "Drink hand sanitizer so we can get rid of :user:",
    ":user:'s free trial of life has expired",
    ":user: is socially awkward",
    ":user: is the reason why society is failing",
    "Pay to lose",
    "Why would I be cheating when I am recording?",
    "Does :user: need some pvp advice?",
    "I'd smack :user:, but that would be animal abuse",
    "I don't cheat, :user: just needs to click faster",
    "Welcome to my rap.e dungeon! population: :user:!",
    "If the body is 70% water then how is :user:'s body 100% salt?",
    ":user: go drown in your own salt",
    "Excuse me :user:, I don't speak retar.d",
    "Hmm, the problem :user:'s having looks like a skin color issue",
    ":user: didn't even stand a chance",
    "If laughter is the best medicine, :user:'s face must be curing the world",
    ":user: is the type of person to climb over a glass wall to see what's on the other side",
    "What does :user:'s IQ and their girlfriend have in common? They're both below 5.",
    "Just rubbed my baIIsack all over :user:s face.",
    ":user: just got AIDs.",
    ":user: just got molested.",
]

export default class Killsults extends Module {
    constructor () {
        super("Killsults", "Insults people after killing them", "Misc", null)
    }

    listener = null;

    onEnable () {
        if (this.listener) {
            this.onDisable();
        }

        this.listener = hooks.bloxdEvents.subscribe("playerKilled", function(data) {
            if (data.killerEId !== hooks.noa.serverPlayerEntity) return;
            if (data.deadEId === hooks.noa.serverPlayerEntity) return;
            let insult = insults[Math.floor(Math.random() * insults.length)];
            let playerName = gameUtils.getPlayerName(data.deadEId);
            insult = insult.replace(":user:", playerName);
            hooks.sendPacket(96, {
                msg: insult,
                channelName: null
            })
        });
    }

    onDisable () {
        hooks.bloxdEvents.unsubscribe(this.listener);
        this.listener = null;
    }

    onGameEntered () {
        this.onEnable();
    }
};