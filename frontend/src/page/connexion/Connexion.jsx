import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../assets/social.png";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./connexion.css";
import { FaCheck } from "react-icons/fa";
import { Cancel } from "@mui/icons-material";
import { FaPencil } from "react-icons/fa6";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import noname from "../../assets/icone/personne.jpeg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useId } from "react"; //générer un id unique
import { OutlinedInput, InputLabel } from "@mui/material";

// Styles réutilisables pour tous les champs
const textFieldStyles = {
  // Styles réutilisables pour tous les champs sx
  sx: {
    "& .MuiInputBase-input": { color: "white" }, //couleur blanche au texte
    "& .MuiOutlinedInput-root": {
      //cible la racine du champ outlinedinput
      "& fieldset": { borderColor: "white" }, //couleur blanche de la bordure
      "&:hover fieldset": { borderColor: "white" }, //couleur blanche de la bordure au survol
      "&.Mui-focused fieldset": { borderColor: "white" }, //couleur blanche de la bordure au focus
    },
  },
  InputLabelProps: {
    // Styles réutilisables pour tous les champs InputLabelProps
    sx: {
      color: "white", //couleur blanche du label
      "&.Mui-focused": { color: "white" }, // couleur blanche du label au focus
    },
  },
};

// Composant réutilisable pour TextField
const CustomTextField = (props) => {
  return (
    <TextField
      sx={textFieldStyles.sx} // Application des styles définis pour la zone de saisie et la bordure
      InputLabelProps={textFieldStyles.InputLabelProps} // Application des styles définis pour le label
      {...props} // Propagation des autres propriétés du composant(label, type,value,...)
    />
  );
};

const Connexion = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // empêche le comportement par défaut de l'événement
  };
  const handleMouseDownPassword1 = (event) => {
    event.preventDefault(); //
  };
  // Générer un ID unique pour les champs de mot de passe
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [verify1, setverify1] = useState(false);
  const [verify2, setverify2] = useState(false);
  const [verify3, setverify3] = useState(false);
  const [verify4, setverify4] = useState(false);
  const [verify5, setverify5] = useState(false);

  const checkPassword = (password) => {
    setcontraint(password.length >= 1 ? true : false); // Vérifie si le mot de passe a au moins 1 caractère.
    setverify1(password.length >= 8); // Vérifie si le mot de passe a au moins 8 caractères.
    setverify2(/[0-9]/.test(password)); // vérifie si le mot de passe contient au moins un chiffre.
    setverify3(/[A-Z]/.test(password)); // vérifie si le mot de passe contient au moins une majuscule.
    setverify4(/[a-z]/.test(password)); // vérifie si le mot de passe contient au moins une minuscule.
    setverify5(/[^A-Za-z0-9]/.test(password)); // vérifie si le mot de passe contient au moins un caractère spécial.
  };
  //
  const ref = useRef(null);
  //état de gestion de l'image de profil
  const [avatar, setavatar] = useState({
    file: null, //fichier brut
    url: "", // URL de l'image avant de le stocker sur le serveur
  });
  // Fonction pour gérer le changement de photo
  const handlephoto = (e) => {
    const free = e.target.files[0];
    if (free) {
      setavatar({
        file: free, //fichier brut de l'image pour le backend
        url: URL.createObjectURL(free), //générer une URL temporaire pour l'aperçu de l'image
      });
    }
  };
  const [contraint, setcontraint] = useState(false);
  const [error, seterror] = useState(false); // état d'erreur
  const [errorMessage, seterrorMessage] = useState(""); //contenu du message d'erreur
  const [formData, setFormData] = useState({
    //formulaire des données du formulaire
    name_utilisateur: "",
    email_utilisateur: "",
    password_utilisateur: "",
    password_confirm: "",
    photo_profil: null,
  });
  // Fonction pour gérer le changement de valeur des champs du formulaire

  const handleChange = (e) => {
    // Mettre à jour l'état du formulaire avec la nouvelle valeur
    setFormData({
      ...formData,
      //[nom du champ]: [valeur du champ]
      [e.target.name]: e.target.value,
    });
    // Vérifier si le champ est le mot de passe
    if (e.target.name === "password_utilisateur") {
      // Si le champ est le mot de passe, vérifier les critères de sécurité
      checkPassword(e.target.value);
    }
  };

  const navigate = useNavigate(); // Utiliser useNavigate pour la redirection
  // Fonction pour changer la photo de profil
  const changephoto = () => {
    if (ref.current) {
      ref.current.click();
    }
  };
  // Fonction pour gérer la soumission du formulaire
  const handlelogin = async (e) => {
    e.preventDefault(); // Empêcher le rechargement de la page
    seterrorMessage(""); // Réinitialiser le message d'erreur
    seterror(false); // Réinitialiser l'état d'erreur
    // Vérification des champs vides
    if (
      !formData.name_utilisateur || // Vérifier si le champ prénom est vide
      !formData.email_utilisateur || // Vérifier si le champ email est vide
      !formData.password_utilisateur ||
      !formData.password_confirm
    ) {
      seterrorMessage("Tous les champs sont obligatoires.");
      seterror(true);
      return; // on s'arrête ici si un champ est vide
    }
    if (formData.password_utilisateur !== formData.password_confirm) {
      seterrorMessage("Les mots de passe ne correspondent pas.");
      seterror(true);
      return; // on s'arrête ici si les mots de passe ne correspondent pas
    }
    if (!verify1 || !verify2 || !verify3 || !verify4 || !verify5) {
      seterrorMessage("Le mot de passe ne respecte pas les critères.");
      seterror(true);
      return; // on s'arrête ici si le mot de passe ne respecte pas les critères
    }

    try {
      const formDataToSend = new FormData(); // Créer un nouvel objet FormData(pour envoyer des textes et fichiers)
      console.log("Données du formulaire:", formData); // Afficher les données du formulaire dans la console
      console.log("Photo de profil:", avatar.file); // Afficher la photo de profil dans la console
      // Ajout des champs texte au FormData
      // formDataToSend.append("clé",valeur);
      formDataToSend.append("name_utilisateur", formData.name_utilisateur);
      formDataToSend.append("email_utilisateur", formData.email_utilisateur);
      formDataToSend.append(
        "password_utilisateur",
        formData.password_utilisateur
      );
      formDataToSend.append("password_confirm", formData.password_confirm);

      // Ajout de la photo si elle existe
      if (avatar.file) {
        console.log("Ajout de la photo au FormData:", avatar.file.name);
        formDataToSend.append("photo_profil", avatar.file, avatar.file.name);
      }
      // Envoi des données au serveur
      // Utiliser fetch pour envoyer les données au serveur
      // Remplacez l'URL par l'URL de votre serveur
      const response = await fetch("http://localhost:5000/users/register", {
        //"http://localhost:5000/users/register" est la route d'enregistrement de l'utilisateur
        method: "POST", // Méthode POST pour envoyer les données
        headers: {
          // En-têtes de la requête
          Accept: "application/json",
        },
        body: formDataToSend, // Corps de la requête contenant les données du formulaire
      });

      //pour pouvoir acceder au champs comme data.message, data.user
      const data = await response.json(); // Convertir la réponse en JSON

      if (!response.ok) {
        //statut code n est pas 200 ok
        console.error("Erreur du serveur:", data);
        seterrorMessage(data.message || "Erreur lors de l'inscription");
        seterror(true);
        return;
      }

      // Stockage des données utilisateur dans le localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          name_utilisateur: formData.name_utilisateur,
          email_utilisateur: formData.email_utilisateur,

          photo_profil: data.user.photo_profil || null,
        })
      );

      toast.success(data.message || "Inscription réussie !", {
        autoClose: 1500,
      });

      // Redirection après inscription réussie
      setUser(true); //mettre à jour l'état de l'utilisateur
      navigate("/publication"); // Rediriger vers la page de publication
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      seterrorMessage("Une erreur s'est produite lors de l'inscription");
      seterror(true);
      toast.error("Erreur lors de l'inscription");
    }
  };
  return (
    <>
      <ToastContainer
        position="top-left"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        theme="dark"
      />
      <div className="identification">
        <div className="connexion">
          <form onSubmit={handlelogin}>
            <div className="connexionTitle">
              <p>Sim'Soxial</p>
              <img src={image} alt="" />
            </div>
            {error && <p id="error">{errorMessage}</p>}
            <div className="formulaire">
              <div className="subform">
                <label
                  htmlFor=""
                  onClick={changephoto}
                  style={{ cursor: "pointer" }}
                >
                  Ajouter photo <FaPencil />
                </label>
                <Stack direction="row" spacing={2}>
                  <Avatar
                    alt=""
                    src={avatar.url || noname}
                    sx={{
                      width: "50px",
                      height: "50px",
                      objectFit: "scale-down",
                      objectPosition: "center",
                    }}
                  />
                </Stack>
                <input
                  type="file"
                  onChange={handlephoto}
                  ref={ref}
                  accept="image/*"
                  name="photo_profil"
                  style={{ display: "none" }}
                />
              </div>
              <div className="subform">
                <label htmlFor="">Prénom</label>
                <CustomTextField
                  label="prénom"
                  type="text"
                  name="name_utilisateur"
                  value={formData.name_utilisateur}
                  onChange={handleChange}
                />
              </div>
              <div className="subform">
                <label htmlFor="">Email</label>
                <CustomTextField
                  label="email"
                  type="email"
                  name="email_utilisateur"
                  value={formData.email_utilisateur}
                  onChange={handleChange}
                />
              </div>
              <div className="subform">
                <label htmlFor="">Mot de passe</label>
                <FormControl variant="outlined" fullWidth {...textFieldStyles}>
                  <InputLabel
                    htmlFor={`password-${passwordId}`}
                    sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id={`password-${passwordId}`} // exemple: password-0
                    type={showPassword ? "text" : "password"}
                    name="password_utilisateur"
                    value={formData.password_utilisateur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "hide the password" : "show password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </div>
              <div className="subform">
                <label htmlFor="">Confirmer mot de passe</label>
                <FormControl variant="outlined" fullWidth {...textFieldStyles}>
                  <InputLabel
                    htmlFor={`confirm-password-${confirmPasswordId}`}
                    sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
                  >
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id={`confirm-password-${confirmPasswordId}`}
                    type={showPassword1 ? "text" : "password"}
                    name="password_confirm"
                    value={formData.password_confirm}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword1
                              ? "hide the password"
                              : "show password"
                          }
                          onClick={handleClickShowPassword1}
                          onMouseDown={handleMouseDownPassword1}
                          edge="end"
                        >
                          {showPassword1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </div>
            </div>
            <div className="button">
              <button type="submit">Créer un compte</button>
            </div>
            <div className="other">
              <p>
                vous avez un compte?{" "}
                <span>
                  {" "}
                  <Link to={"/"}>connectez-vous</Link>{" "}
                </span>
              </p>
            </div>
            <div className="verification">
              {contraint && (
                <div className="password-requirements">
                  <div className="requirement">
                    <span className="icon">
                      {verify1 ? (
                        <FaCheck style={{ color: "green", fontSize: "24px" }} />
                      ) : (
                        <Cancel style={{ color: "red", fontSize: "24px" }} />
                      )}
                    </span>
                    <span className="text">au moins 8 lettres</span>
                  </div>
                  <div className="requirement">
                    <span className="icon">
                      {verify2 ? (
                        <FaCheck style={{ color: "green", fontSize: "24px" }} />
                      ) : (
                        <Cancel style={{ color: "red", fontSize: "24px" }} />
                      )}
                    </span>
                    <span className="text">au moins 1 chiffre</span>
                  </div>
                  <div className="requirement">
                    <span className="icon">
                      {verify3 ? (
                        <FaCheck style={{ color: "green", fontSize: "24px" }} />
                      ) : (
                        <Cancel style={{ color: "red", fontSize: "24px" }} />
                      )}
                    </span>
                    <span className="text">au moins 1 majuscule</span>
                  </div>
                  <div className="requirement">
                    <span className="icon">
                      {verify4 ? (
                        <FaCheck style={{ color: "green", fontSize: "24px" }} />
                      ) : (
                        <Cancel style={{ color: "red", fontSize: "24px" }} />
                      )}
                    </span>
                    <span className="text">au moins 1 minuscule</span>
                  </div>
                  <div className="requirement">
                    <span className="icon">
                      {verify5 ? (
                        <FaCheck style={{ color: "green", fontSize: "24px" }} />
                      ) : (
                        <Cancel style={{ color: "red", fontSize: "24px" }} />
                      )}
                    </span>
                    <span className="text">au moins 1 caractère spécial</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Connexion;
