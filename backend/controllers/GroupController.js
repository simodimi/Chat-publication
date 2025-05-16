const Group = require("../models/Group");
const User = require("../models/User");
const { Op } = require("sequelize");

const GroupController = {
  // Créer un nouveau groupe
  createGroup: async (req, res) => {
    try {
      const { nom_groupe, description, photo_groupe } = req.body;
      const createur_id = req.user.id_utilisateur;

      const group = await Group.create({
        nom_groupe,
        description,
        photo_groupe,
        createur_id,
      });

      // Ajouter le créateur comme membre du groupe
      await group.addMembre(createur_id);

      res.status(201).json(group);
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      res.status(500).json({ message: "Erreur lors de la création du groupe" });
    }
  },

  // Obtenir tous les groupes de l'utilisateur
  getUserGroups: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Group,
            as: "groupes",
            include: [
              {
                model: User,
                as: "createur",
                attributes: [
                  "id_utilisateur",
                  "name_utilisateur",
                  "photo_profil",
                ],
              },
            ],
          },
        ],
      });

      res.json(user.groupes);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des groupes" });
    }
  },

  // Rechercher des groupes
  searchGroups: async (req, res) => {
    try {
      const { query } = req.query;
      const groups = await Group.findAll({
        where: {
          nom_groupe: {
            [Op.like]: `%${query}%`,
          },
        },
        include: [
          {
            model: User,
            as: "createur",
            attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
          },
        ],
      });

      res.json(groups);
    } catch (error) {
      console.error("Erreur lors de la recherche des groupes:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la recherche des groupes" });
    }
  },

  // Rejoindre un groupe
  joinGroup: async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id_utilisateur;

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Groupe non trouvé" });
      }

      await group.addMembre(userId);
      res.json({ message: "Vous avez rejoint le groupe avec succès" });
    } catch (error) {
      console.error("Erreur lors de l'adhésion au groupe:", error);
      res.status(500).json({ message: "Erreur lors de l'adhésion au groupe" });
    }
  },

  // Se désabonner d'un groupe
  leaveGroup: async (req, res) => {
    try {
      const { groupId } = req.params;
      const userId = req.user.id_utilisateur;

      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(404).json({ message: "Groupe non trouvé" });
      }

      // Vérifier si l'utilisateur n'est pas le créateur
      if (group.createur_id === userId) {
        return res
          .status(400)
          .json({ message: "Le créateur ne peut pas quitter le groupe" });
      }

      await group.removeMembre(userId);
      res.json({ message: "Vous avez quitté le groupe avec succès" });
    } catch (error) {
      console.error("Erreur lors du désabonnement du groupe:", error);
      res
        .status(500)
        .json({ message: "Erreur lors du désabonnement du groupe" });
    }
  },

  // Obtenir les détails d'un groupe
  getGroupDetails: async (req, res) => {
    try {
      const { groupId } = req.params;
      const group = await Group.findByPk(groupId, {
        include: [
          {
            model: User,
            as: "createur",
            attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
          },
          {
            model: User,
            as: "membres",
            attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
          },
        ],
      });

      if (!group) {
        return res.status(404).json({ message: "Groupe non trouvé" });
      }

      res.json(group);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du groupe:",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la récupération des détails du groupe",
      });
    }
  },
};

module.exports = GroupController;
