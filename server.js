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


app.use(cors({
    origin: '*',
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.options('/api/home', cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST']
  }));

app.use('/uploads',express.static('uploads'));

app.use('/', routesHandler);

const server = http.createServer(app);

const { io } = require('./routes/socket')(server);



server.listen(process.env.PORT, ()=>{
    console.log("running server...")
});