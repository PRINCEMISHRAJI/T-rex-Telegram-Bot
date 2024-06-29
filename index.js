const express = require("express");
const path = require("path");
const {bot, queries} = require('./bot');

const server = express();
const port = process.env.PORT || 5000;

server.use(express.static(path.join(__dirname, 'public')));

server.get("/highscore/:score", function (req, res, next) {
    console.log('Highscore endpoint hit');
    console.log('Request query:', req.query);
    console.log('Request params:', req.params);

    // Check if the query ID exists in the queries object
    if (!Object.hasOwnProperty.call(queries, req.query.id)) {
        console.error('Query ID not found in queries object');
        return next();
    }

    let query = queries[req.query.id];
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

    console.log('Options for setGameScore:', options);

    bot.setGameScore(query.from.id, parseInt(req.params.score), options, function (err, result) {
        if (err) {
            console.error('Error setting game score:', err);
            res.status(500).send('Error setting game score');
        } else {
            console.log('Game score set successfully:', result);
            res.status(200).send('Game score set successfully');
        }
    });
});

server.listen(port, ()=> {
    console.log(`Server is running on https://localhost:${port}`)
});
