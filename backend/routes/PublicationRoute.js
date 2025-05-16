const express = require("express");
const router = express.Router();
const publicationController = require("../controllers/PublicationController");
const auth = require("../middleware/auth");

// Route pour créer une publication
router.post("/", auth, publicationController.createPublication);

// Route pour récupérer toutes les publications
router.get("/", auth, publicationController.getPublications);

// Route pour supprimer une publication
router.delete(
  "/:id_publication",
  auth,
  publicationController.deletePublication
);

module.exports = router;
