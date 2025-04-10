const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { upload, handleUploadError } = require("../middleware/upload");

// Route pour créer un utilisateur
router.post("/", UserController.createUser);

// Route d'inscription
router.post("/register", UserController.createUser);

// Route de connexion
router.post("/login", UserController.loginUser);

// Route pour mettre à jour la photo de profil
router.put(
  "/:id_utilisateur/photo",
  upload.single("photo_profil"),
  handleUploadError,
  UserController.updatePhotoProfil
);

// Route pour modifier un utilisateur
router.put("/:id_utilisateur", UserController.updateuser);

// Route pour supprimer un utilisateur
router.delete("/:id_utilisateur", UserController.deleteUser);

// Route pour récupérer tous les utilisateurs
router.get("/", UserController.getAllUsers);

// Route pour récupérer un utilisateur
router.get("/:id_utilisateur", UserController.getuserbyid);

router.get("/test", (req, res) => {
  res.send("API en ligne !");
});

module.exports = router;
