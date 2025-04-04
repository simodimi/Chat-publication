const { User } = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer"); //pour uploader des fichiers
const path = require("path"); //pour acceder au dossier public

//configuration de multer pour stocker les images des utilisateurs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "./uploads"));
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
//créer un utilisateur
const createUser = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  console.log("requete recu");
  const {
    name_utilisateur,
    email_utilisateur,
    password_utilisateur,
    password_confirm,
  } = req.body;
  try {
    if (
      !name_utilisateur ||
      !email_utilisateur ||
      !password_utilisateur ||
      !password_confirm
    ) {
      return res
        .status(400)
        .json({ message: "tous les champs sont obligatoire" });
    }
    if (password_utilisateur !== password_confirm) {
      return res
        .status(400)
        .json({ message: "le mot de passe ne correspondent pas" });
    }
    //verifier si l'utilisateur existe
    const existingUser = await User.findOne({
      where: { email_utilisateur },
    });
    if (existingUser) {
      return res.status(400).json({ message: "utilisateur deja existant" });
    }
    //hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password_utilisateur, 10);
    //création de l'utilisateur
    const newUser = await User.create({
      name_utilisateur,
      email_utilisateur,
      password_utilisateur: hashedPassword,
      photo_profil: req.file ? req.file.path : null, //stocker le chemin de l'image dans la base de données
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("erreur lors de l'inscription", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id_utilisateur: req.params.id_utilisateur },
    });
    if (deleted) {
      //verification de la suppression
      return res.status(204).json({ message: "utilisateur supprimer" });
    } else {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur", error);
    res.status(500).json({ message: error.message });
  }
};
//recuperer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    res.status(200).json(user);
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
//recuperer un utilisateur
const getuserbyid = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id_utilisateur);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
//update
const updateuser = async (req, res) => {
  try {
    const [result] = await User.update(req.body, {
      where: { id_utilisateur: req.params.id_utilisateur },
    });
    if (result) {
      return res.status(200).json({ message: "utilisateur mis à jour" });
    } else {
      return res.status(404).json({ message: "utilisateur introuvable" });
    }
  } catch (error) {
    console.error("erreur de récuperation", error);
    res.status(500).json({ message: "erreur serveur" });
  }
};
module.exports = {
  upload,
  createUser: [upload.single("photo_profil"), createUser],
  deleteUser,
  getAllUsers,
  getuserbyid,
  updateuser,
};
