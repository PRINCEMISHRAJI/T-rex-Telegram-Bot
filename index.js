const express = require("express");
const path = require("path");
const bot = require('./bot');

const server = express();
const port = process.env.PORT || 5000;

server.use(express.static(path.join(__dirname, 'public')));

server.get("/highscore/:score", function (req, res, next) {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = bot.queries[req.query.id];
    let options;
    if (query.message) {
        options = {
            chat_id: query.message.chat.id,
            message_id: query.message.message_id
        };
    } else {
        options = {
            inline_message_id: query.inline_message_id
        };
    }
    bot.setGameScore(query.from.id, parseInt(req.params.score), options,
        function (err, result) { });
});

server.listen(port, ()=> {
    console.log("Server is running on https://localhost:${port}")
});
