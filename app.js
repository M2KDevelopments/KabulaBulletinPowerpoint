// Environment variables - https://www.npmjs.com/package/dotenv
require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
 
// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');//Set EJS

app.use('/', require("./api/routes/main"));
app.use('/api/vop', require("./api/routes/vop"));
app.use('/api/bible', require("./api/routes/bible"));

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on ${port}`));