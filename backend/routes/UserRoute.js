const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  getuserbyid,
  updateuser,
  loginUser,
  updatePhotoProfil,
  sendVerificationCode,
  verifyCode,
  resetPassword,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  rejectFriendRequest,
  removeFriend,
  cancelFriendRequest,
  getPendingRequests,
} = require("../controllers/UserController");
const { upload, handleUploadError } = require("../middleware/upload");

// Route de recherche (doit être avant les routes avec paramètres)
router.get("/search", searchUsers);

// Route pour créer un utilisateur
router.post(
  "/",
  upload.single("photo_profil"), // Middleware multer pour traiter un seul fichier nommé "photo_profil"
  handleUploadError, // Middleware pour gérer les erreurs d'upload
  createUser // Contrôleur qui gère la création de l'utilisateur
);

// Route d'inscription
router.post(
  "/register",
  upload.single("photo_profil"),
  handleUploadError,
  createUser
);

// Route de connexion
router.post("/login", loginUser);

// Route pour mettre à jour la photo de profil
router.put(
  "/:id_utilisateur/photo",
  upload.single("photo_profil"),
  handleUploadError,
  updatePhotoProfil
);

// Route pour modifier un utilisateur
router.put("/:id_utilisateur", updateuser);

// Route pour supprimer un utilisateur
router.delete("/:id_utilisateur", deleteUser);

// Route pour récupérer tous les utilisateurs
router.get("/", getAllUsers);

// Route pour récupérer un utilisateur
router.get("/:id_utilisateur", getuserbyid);

// Routes pour la réinitialisation de mot de passe
router.post("/forgot-password", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);

// Routes d'amitié
router.post("/friend-request", sendFriendRequest);
router.get("/pending-requests/:userId", getPendingRequests);
router.put("/friend-request/:requestId/accept", acceptFriendRequest);
router.put("/friend-request/:requestId/reject", rejectFriendRequest);
router.delete("/friend-request/:requestId/cancel", cancelFriendRequest);
router.get("/friends/:userId", getFriends);
router.delete("/friends/:userId/:friendId", removeFriend);

/*
router.get("/test", (req, res) => {
  res.send("API en ligne !"); 
});*/

module.exports = router;
