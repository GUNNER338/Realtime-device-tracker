const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

const socketio = require("socket.io");
const server = http.createServer(app);

const io = socketio(server);

io.on("connection", function (socket) {
  console.log("Client connected:", socket.id);

  socket.on("send-location", function (longitude, latitude) {
    console.log("Received location from", socket.id, longitude, latitude);

    // Spread lat/lng into response
    io.emit("receive-location", {
      id: socket.id,
      longitude: longitude,
      latitude: latitude
    });
  });
  socket.on("disconnect", function(){
      io.emit("user-disconnected",socket.id)
  })
});



app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.render("index");
});

server.listen(3000);
