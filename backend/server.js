const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté:", socket.id);

  socket.on("create-room", ({ type, userId }) => {
    const roomId = Math.random().toString(36).substring(7);
    rooms.set(roomId, {
      type,
      participants: [
        {
          id: userId,
          socketId: socket.id,
        },
      ],
    });
    socket.join(roomId);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId, userId }) => {
    const room = rooms.get(roomId);
    if (room) {
      socket.join(roomId);
      room.participants.push({
        id: userId,
        socketId: socket.id,
      });

      // Notifier les participants existants
      socket.to(roomId).emit("user-joined", { userId });
    }
  });

  socket.on("offer", ({ roomId, userId, offer }) => {
    const room = rooms.get(roomId);
    if (room) {
      const targetParticipant = room.participants.find((p) => p.id === userId);
      if (targetParticipant) {
        io.to(targetParticipant.socketId).emit("offer", {
          userId: socket.id,
          offer,
        });
      }
    }
  });

  socket.on("answer", ({ roomId, userId, answer }) => {
    const room = rooms.get(roomId);
    if (room) {
      const targetParticipant = room.participants.find((p) => p.id === userId);
      if (targetParticipant) {
        io.to(targetParticipant.socketId).emit("answer", {
          userId: socket.id,
          answer,
        });
      }
    }
  });

  socket.on("ice-candidate", ({ roomId, userId, candidate }) => {
    const room = rooms.get(roomId);
    if (room) {
      const targetParticipant = room.participants.find((p) => p.id === userId);
      if (targetParticipant) {
        io.to(targetParticipant.socketId).emit("ice-candidate", {
          userId: socket.id,
          candidate,
        });
      }
    }
  });

  socket.on("leave-room", ({ roomId }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.participants = room.participants.filter(
        (p) => p.socketId !== socket.id
      );
      socket.to(roomId).emit("user-left", { userId: socket.id });

      if (room.participants.length === 0) {
        rooms.delete(roomId);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté:", socket.id);

    // Nettoyer les salles
    rooms.forEach((room, roomId) => {
      room.participants = room.participants.filter(
        (p) => p.socketId !== socket.id
      );
      if (room.participants.length === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit("user-left", { userId: socket.id });
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
