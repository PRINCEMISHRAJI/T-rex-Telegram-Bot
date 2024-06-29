require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "5492112887:AAFvRtT1y5Dqcxvu1inItmSUSRwcsSsanro";
const bot = new TelegramBot(TOKEN, { polling: true } );


const gameName = "Trexrobo";
const queries = {};

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This bot implements a T-Rex jumping game. Say /game if you want to play."));
bot.onText(/start|game/, (msg) => bot.sendGame(msg.from.id, gameName));

bot.on("callback_query", function (query) {
    if (query.game_short_name !== gameName) {
        bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
    } else {
        queries[query.id] = query;
        let gameurl = "https://t-rex-telegram-bot.onrender.com/index.html?id="+query.id;
        bot.answerCallbackQuery({
            callback_query_id: query.id,
            url: gameurl
        });
    }
});

bot.on("inline_query", function(iq) {
    bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] ); 
});

module.exports = {bot, queries};