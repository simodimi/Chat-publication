const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");
const auth = require("../middleware/auth");

// Routes protégées par l'authentification
router.use(auth);

// Créer un nouveau groupe
router.post("/create", GroupController.createGroup);

// Obtenir tous les groupes de l'utilisateur
router.get("/user/:userId", GroupController.getUserGroups);

// Rechercher des groupes
router.get("/search", GroupController.searchGroups);

// Rejoindre un groupe
router.post("/:groupId/join", GroupController.joinGroup);

// Se désabonner d'un groupe
router.post("/:groupId/leave", GroupController.leaveGroup);

// Obtenir les détails d'un groupe
router.get("/:groupId", GroupController.getGroupDetails);

module.exports = router;
