const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./config/database"); // Sequelize instance
const userRoutes = require("./routes/UserRoute"); // Tes routes utilisateurs
const messageRoutes = require("./routes/messageRoutes"); // Ajout des routes de messages
const groupRoutes = require("./routes/groupRoutes"); // Ajout des routes de groupes
const publicationRoutes = require("./routes/PublicationRoute");
const path = require("path");
const fs = require("fs");
const statusRoutes = require("./routes/StatusRoute");
const { Status } = require("./models"); // Import des modèles

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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de débogage
app.use((req, res, next) => {
  console.log(`📨 Requête reçue: ${req.method} ${req.url}`);
  next();
});

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Routes API (ex: http://localhost:5000/api/users)
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes); // Ajout des routes de messages
app.use("/api/groups", groupRoutes); // Ajout des routes de groupes
app.use("/api/publications", publicationRoutes);
app.use("/api/status", statusRoutes);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur globale:", err);
  res.status(500).json({
    message: "Erreur serveur",
    error: err.message,
  });
});
//photo dans l'email
app.use("/public", express.static(path.join(__dirname, "public")));
// Création du serveur HTTP
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Stocker l'instance io dans l'application
app.set("io", io);

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté:", socket.id);

  // Rejoindre la salle de l'utilisateur
  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Utilisateur ${userId} a rejoint sa salle`);
  });

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté:", socket.id);
  });
});

// Synchroniser la base de données avec les modèles
db.sync({ alter: true })
  .then(() => {
    console.log("✅ Base de données synchronisée avec succès");
  })
  .catch((err) => {
    console.error(
      "❌ Erreur lors de la synchronisation de la base de données:",
      err
    );
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
      console.log("📡 Routes disponibles :");
      console.log("- GET /api/users/*");
      console.log("- POST /api/messages/send");
      console.log("- GET /api/messages/conversation/:userId1/:userId2");
      console.log("- PUT /api/messages/read/:messageId");
    });
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion à la base de données:", err);
    process.exit(1);
  });
