// Declarations
const express = require('express');
const bodyParser= require('body-parser');
var mongoose = require('mongoose');
const app = express();
var router = express.Router();
require('dotenv').config({path: 'keys.env'})

// Config
require('./config/settings/settings.js')(app, bodyParser);
require('./config/headers/headers.js')(app);
require('./config/mongo/mongo.js')(app, mongoose);

// Routes
var User = require('./routes/api/users/users-schema.js')(app, mongoose);
require('./routes/api/users/users-routes.js')(app, router, User);
