const User = require("../models/User");
const bcrypt = require("bcrypt");
const { upload, handleUploadError } = require("../middleware/upload");
const path = require("path");
const fs = require("fs");

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

    // Retourner les données de l'utilisateur sans le mot de passe
    return res.status(200).json({
      id_utilisateur: user.id_utilisateur,
      name_utilisateur: user.name_utilisateur,
      email_utilisateur: user.email_utilisateur,
      photo_profil: user.photo_profil,
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
module.exports = {
  createUser,
  deleteUser,
  getAllUsers,
  getuserbyid,
  updateuser,
  loginUser,
};
