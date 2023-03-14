let express = require('express');
let path = require('path');
let logger = require('morgan');
let cors = require("cors")

// Database setup
require ('./config/database')

//Users e notes endpoints
let usersRouter = require('./app/routes/users');
let notesRouter = require('./app/routes/notes');


let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors)

app.use('/notes', notesRouter);
app.use('/users', usersRouter);

module.exports = app;
