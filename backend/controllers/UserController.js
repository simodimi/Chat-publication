const { User, FriendRequest, Friendship } = require("../models");
const bcrypt = require("bcrypt");
const Mailjet = require("node-mailjet");
const { upload, handleUploadError } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
//const image = "http://localhost:5000/public/logo/social.png";
// Configuration de Mailjet
const mailjet = new Mailjet({
  apiKey: process.env.EMAIL_USER,
  apiSecret: process.env.EMAIL_PASSWORD,
});

//connexion utilisateur
const loginUser = async (req, res) => {
  try {
    const { email_utilisateur, password_utilisateur } = req.body;

    if (!email_utilisateur || !password_utilisateur) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    // Vérification de l'existence de l'utilisateur
    const user = await User.findOne({ where: { email_utilisateur } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(
      password_utilisateur,
      user.password_utilisateur
    );
    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Construction de l'URL complète de la photo de profil
    const photo_profil = user.photo_profil
      ? user.photo_profil.startsWith("http")
        ? user.photo_profil
        : `http://localhost:5000/uploads/${user.photo_profil.split("/").pop()}`
      : null;

    console.log("Photo de profil originale:", user.photo_profil); // Pour le débogage
    console.log("Photo de profil construite:", photo_profil); // Pour le débogage

    // Générer le token JWT
    const token = jwt.sign(
      {
        id_utilisateur: user.id_utilisateur,
        email_utilisateur: user.email_utilisateur,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retourner les données de l'utilisateur + le token
    return res.status(200).json({
      id_utilisateur: user.id_utilisateur,
      name_utilisateur: user.name_utilisateur,
      email_utilisateur: user.email_utilisateur,
      photo_profil: photo_profil,
      token: token,
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
//créer un utilisateur
const createUser = async (req, res) => {
  console.log("=== Début de la création d'utilisateur ===");
  console.log("Corps de la requête:", req.body);
  console.log("Fichier reçu:", req.file);

  try {
    const {
      name_utilisateur,
      email_utilisateur,
      password_utilisateur,
      password_confirm,
    } = req.body;

    // Validation des champs
    if (
      !name_utilisateur ||
      !email_utilisateur ||
      !password_utilisateur ||
      !password_confirm
    ) {
      console.log("❌ Champs manquants");
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    if (password_utilisateur !== password_confirm) {
      console.log("❌ Les mots de passe ne correspondent pas");
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Vérification de l'existence de l'utilisateur
    console.log("🔍 Vérification de l'existence de l'utilisateur...");
    const existingUser = await User.findOne({
      where: { email_utilisateur },
    });

    if (existingUser) {
      console.log("❌ Utilisateur déjà existant");
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hashage du mot de passe
    console.log("🔒 Hashage du mot de passe...");
    const hashedPassword = await bcrypt.hash(password_utilisateur, 10);

    // Préparation des données pour la création
    const userData = {
      name_utilisateur,
      email_utilisateur,
      password_utilisateur: hashedPassword,
    };

    // Ajout du chemin de la photo si elle existe
    if (req.file) {
      const photoPath = `/uploads/${req.file.filename}`;
      userData.photo_profil = photoPath;
      console.log("📸 Photo de profil ajoutée:", photoPath);
    }

    // Création de l'utilisateur
    console.log("➕ Création de l'utilisateur...");
    const newUser = await User.create(userData);

    console.log("✅ Utilisateur créé avec succès");
    res.status(201).json({
      message: "Inscription réussie",
      user: {
        id_utilisateur: newUser.id_utilisateur,
        name_utilisateur: newUser.name_utilisateur,
        email_utilisateur: newUser.email_utilisateur,
        photo_profil: newUser.photo_profil
          ? `http://localhost:5000${newUser.photo_profil}`
          : null,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'inscription:", error);

    // Si c'est une erreur de validation Sequelize
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Erreur de validation",
        errors: error.errors.map((e) => e.message),
      });
    }

    // Pour les autres erreurs
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id_utilisateur: req.params.id_utilisateur },
    });
    if (deleted) {
      //verification de la suppression
      return res.status(204).json({ message: "utilisateur supprimer" });
    } else {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur", error);
    res.status(500).json({ message: error.message });
  }
};
//recuperer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
//recuperer un utilisateur
const getuserbyid = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id_utilisateur);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
//update
const updateuser = async (req, res) => {
  try {
    const [result] = await User.update(req.body, {
      where: { id_utilisateur: req.params.id_utilisateur },
    });
    if (result) {
      return res.status(200).json({ message: "utilisateur mis à jour" });
    } else {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};

const updatePhotoProfil = async (req, res) => {
  try {
    const { id_utilisateur } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Aucune photo n'a été envoyée" });
    }

    // Vérification de l'existence de l'utilisateur
    const user = await User.findByPk(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    // Suppression de l'ancienne photo si elle existe
    if (user.photo_profil) {
      const oldPhotoPath = path.join(
        __dirname,
        "..",
        "public",
        user.photo_profil
      );
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Construction du chemin de la nouvelle photo
    const photoPath = `/uploads/${req.file.filename}`;

    // Mise à jour de la photo de profil dans la base de données
    await user.update({ photo_profil: photoPath });

    // Construction de l'URL complète de la nouvelle photo
    const photoUrl = `http://localhost:5000${photoPath}`;

    return res.status(200).json({
      message: "Photo de profil mise à jour avec succès",
      photo_profil: photoUrl,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la photo:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Fonction pour générer un code de vérification à six chiffres
const generateVerificationCode = () => {
  const code = Math.floor(100000 + Math.random() * 900000);
  return code.toString().padStart(6, "0");
};

// Stockage temporaire des codes de vérification avec timer
const verificationCodes = new Map();

// Fonction pour nettoyer les codes expirés
const cleanExpiredCodes = () => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (now - data.timestamp > 5 * 60 * 1000) {
      // 5 minutes
      verificationCodes.delete(email);
    }
  }
};

// Exécuter le nettoyage toutes les minutes
setInterval(cleanExpiredCodes, 60 * 1000);

// Envoyer un code de vérification
const sendVerificationCode = async (req, res) => {
  try {
    console.log("Requête de réinitialisation reçue:", req.body);
    const { email_utilisateur } = req.body;

    if (!email_utilisateur) {
      console.log("Email manquant");
      return res.status(400).json({ message: "L'email est requis" });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ where: { email_utilisateur } });
    if (!user) {
      console.log("Utilisateur non trouvé:", email_utilisateur);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Générer et stocker le code
    const code = generateVerificationCode();
    console.log("Code généré:", code);
    verificationCodes.set(email_utilisateur, {
      code,
      timestamp: Date.now(),
    });

    // Envoyer le code par email avec Mailjet
    const request = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: "Sim'Soxial",
          },
          To: [
            {
              Email: email_utilisateur,
              Name: user.name_utilisateur,
            },
          ],
          Subject: "Code de réinitialisation de mot de passe",
          HTMLPart: `
              <div style="text-align: center;">
              <h1 style="margin-bottom: 10px;">Sim'Soxial</h1>
              <img src="http://localhost:5000/public/logo/social.png" alt="Logo" style="width: 90px; height: 90px;" />
              </div>
           
              <h2>Réinitialisation de votre mot de passe</h2>
              <p>Bonjour ${user.name_utilisateur},</p>
              <p>Voici votre code de vérification : <strong>${code}</strong></p>
              <p>Ce code expirera dans 5 minutes.</p>
              <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
            `,
        },
      ],
    });

    console.log("Email envoyé avec succès:", request.body);

    res.status(200).json({
      message: "Code envoyé avec succès à votre adresse email",
      code: code,
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
};

// Vérifier le code
const verifyCode = async (req, res) => {
  try {
    const { email_utilisateur, code } = req.body;

    if (!email_utilisateur || !code) {
      return res.status(400).json({ message: "Email et code requis" });
    }

    const storedCode = verificationCodes.get(email_utilisateur);
    if (!storedCode) {
      return res.status(400).json({ message: "Code non trouvé ou expiré" });
    }

    // Vérifier si le code a expiré (5 minutes)
    if (Date.now() - storedCode.timestamp > 5 * 60 * 1000) {
      verificationCodes.delete(email_utilisateur);
      return res
        .status(400)
        .json({ message: "Code expiré. Veuillez faire une nouvelle demande." });
    }

    if (storedCode.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    res.status(200).json({ message: "Code vérifié avec succès" });
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { email_utilisateur, code, new_password } = req.body; // données du corps envoyées par le client

    if (!email_utilisateur || !code || !new_password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier le code
    const storedCode = verificationCodes.get(email_utilisateur); // récupérer le code stocké
    // Vérifier si le code existe et correspond à celui envoyé
    if (!storedCode || storedCode.code !== code) {
      return res.status(400).json({ message: "Code invalide" });
    }

    // Vérifier si le code a expiré (5 minutes)
    if (Date.now() - storedCode.timestamp > 5 * 60 * 1000) {
      // Supprimer le code expiré
      verificationCodes.delete(email_utilisateur);
      return res.status(400).json({ message: "Code expiré" });
    }

    // Mettre à jour le mot de passe
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await User.update(
      { password_utilisateur: hashedPassword }, // mettre à jour le mot de passe
      { where: { email_utilisateur } }
    );

    // Supprimer le code utilisé
    verificationCodes.delete(email_utilisateur);

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Rechercher des utilisateurs
const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Recherche d'utilisateurs avec le terme:", q);

    if (!q) {
      return res
        .status(400)
        .json({ message: "Le paramètre de recherche est requis" });
    }

    // Vérifier si l'utilisateur existe exactement
    const exactUser = await User.findOne({
      where: {
        name_utilisateur: q,
      },
    });
    console.log("Utilisateur exact trouvé:", exactUser);

    // Rechercher les utilisateurs avec LIKE
    const users = await User.findAll({
      where: {
        name_utilisateur: {
          [Op.like]: `%${q}%`,
        },
      },
      attributes: [
        "id_utilisateur",
        "name_utilisateur",
        "photo_profil",
        "email_utilisateur",
      ],
    });
    console.log("Utilisateurs trouvés avec LIKE:", users);

    if (users.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé" });
    }

    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la recherche des utilisateurs:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche des utilisateurs" });
  }
};

// Envoyer une demande d'amitié
const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log("Envoi d'une demande d'amitié:", { senderId, receiverId });

    // Vérifier si une demande existe déjà
    const existingRequest = await FriendRequest.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingRequest) {
      console.log("Une demande existe déjà");
      return res
        .status(400)
        .json({ message: "Une demande d'amitié existe déjà" });
    }

    // Créer la nouvelle demande
    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
      status: "pending",
    });

    // Récupérer la demande avec les informations du sender et du receiver
    const requestWithDetails = await FriendRequest.findByPk(friendRequest.id, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
    });

    console.log("Demande créée avec succès:", requestWithDetails);
    res.status(201).json(requestWithDetails);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de la demande d'amitié" });
  }
};

// Accepter une demande d'amitié
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findByPk(requestId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Demande d'amitié non trouvée" });
    }

    // Mettre à jour le statut de la demande
    await request.update({ status: "accepted" });

    // Créer la relation d'amitié dans les deux sens
    await Friendship.create({
      userId: request.senderId,
      friendId: request.receiverId,
    });

    await Friendship.create({
      userId: request.receiverId,
      friendId: request.senderId,
    });

    // Récupérer les informations de l'ami
    const friend = await User.findByPk(request.senderId, {
      attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
    });

    res.json({
      message: "Demande d'amitié acceptée",
      friend: friend,
    });
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la demande:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'acceptation de la demande d'amitié" });
  }
};

// Nouvelle fonction pour récupérer les demandes en attente
const getPendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await FriendRequest.findAll({
      where: {
        senderId: userId,
        status: "pending",
      },
      include: [
        {
          model: User,
          as: "receiver",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
    });

    res.json(requests);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des demandes en attente:",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des demandes en attente",
    });
  }
};

// Obtenir la liste des amis
const getFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const friends = await Friendship.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: "friend",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
    });

    res.json(friends.map((friendship) => friendship.friend));
  } catch (error) {
    console.error("Erreur lors de la récupération des amis:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des amis" });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: "Demande d'ami non trouvée" });
    }

    await request.update({ status: "rejected" });

    // Émettre un événement Socket.IO
    const io = req.app.get("socketio");
    io.to(request.senderId.toString()).emit("friendRequestRejected", {
      receiver: await User.findByPk(request.receiverId),
    });

    res.json({ message: "Demande d'ami refusée avec succès" });
  } catch (error) {
    console.error("Erreur lors du refus de la demande d'ami:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du refus de la demande d'ami" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.params;

    // Supprimer les deux relations d'amitié (bidirectionnelles)
    await Friendship.destroy({
      where: {
        [Op.or]: [
          { userId, friendId },
          { userId: friendId, friendId: userId },
        ],
      },
    });

    // Émettre un événement Socket.IO
    const io = req.app.get("socketio");
    io.to(userId).emit("friendRemoved", {
      friend: await User.findByPk(friendId),
    });
    io.to(friendId).emit("friendRemoved", {
      friend: await User.findByPk(userId),
    });

    res.json({ message: "Ami supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ami:", error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'ami" });
  }
};

const cancelFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await FriendRequest.findByPk(requestId, {
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id_utilisateur", "name_utilisateur"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id_utilisateur", "name_utilisateur"],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Demande non trouvée" });
    }

    // Émettre l'événement Socket.IO
    const io = req.app.get("socketio");
    if (io && request.receiver && request.receiver.id_utilisateur) {
      io.to(request.receiver.id_utilisateur.toString()).emit(
        "friendRequestCancelled",
        {
          requestId: request.id,
          sender: request.sender,
        }
      );
    }

    await request.destroy();
    res.json({ message: "Demande annulée avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'annulation de la demande:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'annulation de la demande" });
  }
};

module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getuserbyid,
  updateuser,
  loginUser,
  updatePhotoProfil,
  sendVerificationCode,
  verifyCode,
  resetPassword,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  rejectFriendRequest,
  removeFriend,
  cancelFriendRequest,
  getPendingRequests,
};
