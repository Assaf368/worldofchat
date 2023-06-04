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
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, PATCH, GET, DELETE"
      )
      return res.status(200).json({})
    }
    next()
  })

app.use('/uploads',express.static('uploads'));

app.use('/', routesHandler);

const server = http.createServer(app);

const { io } = require('./routes/socket')(server);



server.listen(process.env.PORT, ()=>{
    console.log("running server...")
});