const Publication = require("../models/Publication");
const User = require("../models/User");
const { Op } = require("sequelize");

// Créer une nouvelle publication
exports.createPublication = async (req, res) => {
  try {
    const { texte, media, audio } = req.body;
    const id_utilisateur = req.user.id_utilisateur;

    const publication = await Publication.create({
      id_utilisateur,
      texte,
      media: media || [],
      audio: audio || [],
    });

    // Récupérer les informations de l'utilisateur avec la publication
    const publicationWithUser = await Publication.findOne({
      where: { id_publication: publication.id_publication },
      include: [
        {
          model: User,
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
          as: "user",
        },
      ],
    });

    // Transformer les données pour correspondre au format attendu
    const formattedPublication = {
      ...publicationWithUser.toJSON(),
      user: {
        id_utilisateur: publicationWithUser.user.id_utilisateur,
        name_utilisateur: publicationWithUser.user.name_utilisateur,
        photo_profil: publicationWithUser.user.photo_profil,
      },
    };

    res.status(201).json(formattedPublication);
  } catch (error) {
    console.error("Erreur lors de la création de la publication:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la publication" });
  }
};

// Récupérer toutes les publications (des amis et de l'utilisateur)
exports.getPublications = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;

    // Récupérer toutes les publications avec les informations de l'utilisateur
    const publications = await Publication.findAll({
      include: [
        {
          model: User,
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
          as: "user", // Spécifier l'alias pour la relation
        },
      ],
      order: [["date_publication", "DESC"]],
    });

    // Transformer les données pour s'assurer que la structure est correcte
    const formattedPublications = publications.map((pub) => ({
      ...pub.toJSON(),
      user: {
        id_utilisateur: pub.user.id_utilisateur,
        name_utilisateur: pub.user.name_utilisateur,
        photo_profil: pub.user.photo_profil
          ? pub.user.photo_profil.startsWith("http")
            ? pub.user.photo_profil
            : `http://localhost:5000${pub.user.photo_profil}`
          : null,
      },
    }));

    res.json(formattedPublications);
  } catch (error) {
    console.error("Erreur lors de la récupération des publications:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des publications" });
  }
};

// Supprimer une publication
exports.deletePublication = async (req, res) => {
  try {
    const { id_publication } = req.params;
    const id_utilisateur = req.user.id_utilisateur;

    const publication = await Publication.findOne({
      where: {
        id_publication,
        id_utilisateur,
      },
    });

    if (!publication) {
      return res.status(404).json({ message: "Publication non trouvée" });
    }

    await publication.destroy();
    res.json({ message: "Publication supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la publication:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de la publication" });
  }
};
