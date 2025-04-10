const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database"); // Sequelize instance
const userRoutes = require("./routes/UserRoute"); // Tes routes utilisateurs
const path = require("path");
const fs = require("fs");

// Vérification des variables d'environnement
console.log("🔍 Vérification des variables d'environnement...");
dotenv.config();
if (
  !process.env.HOST ||
  !process.env.USER ||
  !process.env.PASSWORD ||
  !process.env.NAME
) {
  console.error("❌ Variables d'environnement manquantes");
  process.exit(1);
}

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Dossier uploads créé avec succès");
}

const app = express();

// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes API (ex: http://localhost:5173/users)
app.use("/users", userRoutes);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur globale:", err);
  res.status(500).json({
    message: "Erreur serveur",
    error: err.message,
  });
});

// Création du serveur HTTP
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// ---------------- WebSocket Logic ----------------
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
      socket.to(roomId).emit("user-joined", { userId });
    }
  });

  socket.on("offer", ({ roomId, userId, offer }) => {
    const room = rooms.get(roomId);
    if (room) {
      const target = room.participants.find((p) => p.id === userId);
      if (target) {
        io.to(target.socketId).emit("offer", {
          userId: socket.id,
          offer,
        });
      }
    }
  });

  socket.on("answer", ({ roomId, userId, answer }) => {
    const room = rooms.get(roomId);
    if (room) {
      const target = room.participants.find((p) => p.id === userId);
      if (target) {
        io.to(target.socketId).emit("answer", {
          userId: socket.id,
          answer,
        });
      }
    }
  });

  socket.on("ice-candidate", ({ roomId, userId, candidate }) => {
    const room = rooms.get(roomId);
    if (room) {
      const target = room.participants.find((p) => p.id === userId);
      if (target) {
        io.to(target.socketId).emit("ice-candidate", {
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

// ---------------- Lancement du Serveur ----------------
const PORT = process.env.PORT || 5000;

console.log("🔄 Tentative de connexion à la base de données...");
db.sync()
  .then(() => {
    console.log("✅ Connexion à la base de données réussie");
    console.log(`🔄 Démarrage du serveur sur le port ${PORT}...`);
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur API + WebSocket lancé sur le port ${PORT}`);
      console.log(`🌐 URL du serveur: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données:", err);
    process.exit(1);
  });
