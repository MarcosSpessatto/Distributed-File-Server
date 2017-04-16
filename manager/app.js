import express from 'express'
import bodyParser from 'body-parser'
import consign from 'consign'
import cors from 'cors'
import io from 'socket.io'
import SocketService from './services/SocketService'
import validate from './helpers/StartHelper'
import SocketClientServer from './services/SocketClientServer'

validate(process.argv);

const app = express();

app.use(bodyParser.json({
    limit: "5gb"
}));

//Socket IO
app.io = io();

app.use(bodyParser.urlencoded({
    extended: true,
    limit: "5gb"
}));

app.use(cors());

SocketService.init(app);

SocketClientServer.init();

//Load all modules
consign({
        verbose: false
    })
    .include('db')
    .then('helpers')
    .then('models')
    .then('controllers')
    .then('routes')
    .into(app);

//404 error
app.use((request, response, next) => {
    var err = new Error('Not found!');
    err.status = 404;
    next(err);
});

//error handling
app.use((err, request, response, next) => {
    response.status(err.status || 500).json({
        err: err.message
    });
});

module.exports = app;