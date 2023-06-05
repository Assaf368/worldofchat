require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const routesHandler = require('./routes/handler');
const http = require("http");




mongoose.connect(process.env.DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology:true})
.then(()=>{
    console.log("mongo connection is open!");
})
.catch(err => {
    console.log(err);
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://chat-project-6mzh4qun6-assaf3434-gmailcom.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

app.use('/uploads',express.static('uploads'));

app.use('/', routesHandler);

const server = http.createServer(app);

const { io } = require('./routes/socket')(server);



server.listen(process.env.PORT, ()=>{
    console.log("running server...")
});