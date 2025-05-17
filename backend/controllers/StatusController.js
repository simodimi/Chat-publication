const Status = require("../models/Status");
const User = require("../models/User");
const { Op } = require("sequelize");

// Créer un nouveau statut
const createStatus = async (req, res) => {
  try {
    const { type, content, texte, styles } = req.body;
    const id_utilisateur = req.user.id_utilisateur; // Récupéré du token JWT

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer le statut
    const status = await Status.create({
      id_utilisateur,
      type,
      content,
      texte,
      styles: styles || {}, // Ajout des styles
    });

    // Récupérer le statut avec les informations de l'utilisateur
    const statusWithUser = await Status.findByPk(status.id_status, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
    });

    res.status(201).json(statusWithUser);
  } catch (error) {
    console.error("Erreur lors de la création du statut:", error);
    res.status(500).json({ message: "Erreur lors de la création du statut" });
  }
};

// Récupérer tous les statuts actifs (non expirés)
const getActiveStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll({
      where: {
        date_expiration: {
          [Op.gt]: new Date(), // Plus grand que la date actuelle
        },
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
      order: [["date_creation", "DESC"]],
    });

    res.json(statuses);
  } catch (error) {
    console.error("Erreur lors de la récupération des statuts:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des statuts" });
  }
};

// Supprimer un statut
const deleteStatus = async (req, res) => {
  try {
    const { id_status } = req.params;
    const id_utilisateur = req.user.id_utilisateur;

    const status = await Status.findOne({
      where: {
        id_status,
        id_utilisateur,
      },
    });

    if (!status) {
      return res.status(404).json({ message: "Statut non trouvé" });
    }

    await status.destroy();
    res.json({ message: "Statut supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du statut:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du statut" });
  }
};

module.exports = {
  createStatus,
  getActiveStatuses,
  deleteStatus,
};
