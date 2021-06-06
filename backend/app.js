const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./db');
const app = express();
const server = require("http").Server(app);
const io = require("socket.io").listen(server);
const SocketServer = require("./socket");
const db = require("./servers/db.json");
const adminRouter = require("./router");
const path = require("path");
var redis = require('socket.io-redis');

mongoose.connect(db.TESTDB, { useNewUrlParser: true ,useFindAndModify: false,useUnifiedTopology: true,useCreateIndex : true}).then(() => {
  console.log('Database is connected');


  app.use(cors());

  app.use("*",(req,res,next)=>{
    let expires = new Date(new Date().valueOf() + 30 * 24 * 60 * 60 * 1000);
    res.cookie('cookie1', 'value1', { sameSite: 'lax',httpOnly : true ,expires :expires ,path : "/" });   next(); });
  app.use(express.static('./clients'));
  app.use(express.static('./clients/builds'));
  app.use(express.static('./clients/uploads'));
  app.use(express.static('./clients/apps'));
  app.use(bodyParser.json({limit: "15360mb", type:'application/json'}));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("socketio", io);
  app.use('/admin',adminRouter);
    
  SocketServer(io);  

  server.listen(db.ServerPort, () => {
    console.log(`Started server on => http://localhost:${db.ServerPort}`);
  });
  },
  err => { console.log('Can not connect to the database'+ err)}
);