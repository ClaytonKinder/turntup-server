// Declarations
const express = require('express');
const bodyParser= require('body-parser');
var mongoose = require('mongoose');
const app = express();
var router = express.Router();
require('dotenv').config({path: 'keys.env'});
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
app.set('secret', process.env.SECRET);
var jwt = require('jsonwebtoken');

// Config
require('./config/settings/settings.js')(app, bodyParser);
require('./config/headers/headers.js')(app);
require('./config/mongo/mongo.js')(app, mongoose);

// Schemas
var User = require('./schemas/users/users-schema.js')(app, mongoose, bcrypt, SALT_WORK_FACTOR);
// Routes
require('./routes/api/users/users-routes.js')(app, router, User);
require('./routes/api/authentication/authentication-routes.js')(app, router, User, jwt);
