const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Route pour créer un utilisateur
router.post("/", UserController.createUser);

// Route d'inscription
router.post("/register", UserController.createUser);
// Route de connexion
router.post("/login", UserController.loginUser);
//route pour modifier un use
router.put("/:id_utilisateur", UserController.updateuser);
//route pour supprimer un utilisateur
router.delete("/:id_utilisateur", UserController.deleteUser);
//route pour recuperer tous les utilisateurs
router.get("/", UserController.getAllUsers);
//route pour recuperer un utilisateur
router.get("/:id_utilisateur", UserController.getuserbyid);
router.get("/test", (req, res) => {
  res.send("API en ligne !");
});
module.exports = router;
