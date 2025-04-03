const express = require("express");
const router = express.Router();
const {
  upload,
  createUser,
  updateuser,
  deleteUser,
  getAllUsers,
  getuserbyid,
} = require("../controllers/UserController");

// Route pour créer un utilisateur (avec gestion du téléchargement de fichier)
router.post("/", upload.single("photo_profil"), createUser);

//route pour modifier un use
router.put("/:id_utilisateur", updateuser);
//route pour supprimer un utilisateur
router.delete("/:id_utilisateur", deleteUser);
//route pour recuperer tous les utilisateurs
router.get("/", getAllUsers);
//route pour recuperer un utilisateur
router.get("/:id_utilisateur", getuserbyid);

module.exports = router;
