const express = require("express");
const router = express.Router();
const {
  createStatus,
  getActiveStatuses,
  deleteStatus,
} = require("../controllers/StatusController");
const authMiddleware = require("../middleware/auth");

// Route pour créer un statut (protégée par authentification)
router.post("/", authMiddleware, createStatus);

// Route pour récupérer tous les statuts actifs
router.get("/", authMiddleware, getActiveStatuses);

// Route pour supprimer un statut (protégée par authentification)
router.delete("/:id_status", authMiddleware, deleteStatus);

module.exports = router;
