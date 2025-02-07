
const express = require("express");
const app = express();

const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

const server = http.createServer(app);

app.use(cors());

let currentRoomId;

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log(`User connected with Id : ${socket.id}`);

    socket.on("joinRoom", (room) => {
        currentRoomId = room;
        socket.join(currentRoomId);
        console.log(`User with ID: ${socket.id} joined room ${room}`);
        socket.to(room).emit("user_joined", "new user joined");
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(currentRoomId).emit("receive_message", data);
    });

    socket.on("changeRoom", (room) => {
        socket.leave(currentRoomId);
        currentRoomId = room
        socket.join(room);
    });
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

PORT = 3001

server.listen(process.env.PORT || PORT, () => {
    console.log(`Server Listening on ${PORT}`);
});