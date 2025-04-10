import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../../assets/social.png";
import Box from "@mui/material/Box";
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
import { toast } from "react-toastify";
import { useId } from "react";
import { OutlinedInput, InputLabel } from "@mui/material";

// Styles réutilisables pour tous les champs
const textFieldStyles = {
  sx: {
    "& .MuiInputBase-input": { color: "white" },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "white" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "white" },
    },
  },
  InputLabelProps: {
    sx: {
      color: "white",
      "&.Mui-focused": { color: "white" },
    },
  },
};

// Composant réutilisable pour TextField
const CustomTextField = (props) => {
  return (
    <TextField
      sx={textFieldStyles.sx}
      InputLabelProps={textFieldStyles.InputLabelProps}
      {...props}
    />
  );
};

const Connexion = ({ setUser }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const passwordId = useId();
  const confirmPasswordId = useId();

  const [verify1, setverify1] = useState(false);
  const [verify2, setverify2] = useState(false);
  const [verify3, setverify3] = useState(false);
  const [verify4, setverify4] = useState(false);
  const [verify5, setverify5] = useState(false);

  const checkPassword = (password) => {
    setcontraint(password.length >= 1 ? true : false);
    setverify1(password.length >= 8);
    setverify2(/[0-9]/.test(password));
    setverify3(/[A-Z]/.test(password));
    setverify4(/[a-z]/.test(password));
    setverify5(/[^A-Za-z0-9]/.test(password));
  };

  const ref = useRef(null);
  const [avatar, setavatar] = useState({
    file: null,
    url: "",
  });

  const handlephoto = (e) => {
    const free = e.target.files[0];
    if (free) {
      setavatar({
        file: free,
        url: URL.createObjectURL(free),
      });
    }
  };

  const [contraint, setcontraint] = useState(false);
  const [error, seterror] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name_utilisateur: "",
    email_utilisateur: "",
    password_utilisateur: "",
    password_confirm: "",
    photo_profil: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password_utilisateur") {
      checkPassword(e.target.value);
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email_utilisateur,
          password: formData.password_utilisateur,
        }
      );

      if (response.data.token) {
        // Stocker le token dans le localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Rediriger vers la page des messages
        navigate("/message");
      }
    } catch (err) {
      seterrorMessage(
        err.response?.data?.message ||
          "Une erreur est survenue lors de la connexion"
      );
      seterror(true);
    }
  };

  const changephoto = () => {
    if (ref.current) {
      ref.current.click();
    }
  };
  const handlelogin = async (e) => {
    e.preventDefault();
    seterrorMessage("");
    seterror(false);

    if (
      !formData.name_utilisateur ||
      !formData.email_utilisateur ||
      !formData.password_utilisateur ||
      !formData.password_confirm
    ) {
      seterrorMessage("Tous les champs sont obligatoires.");
      seterror(true);
      return;
    }
    if (formData.password_utilisateur !== formData.password_confirm) {
      seterrorMessage("Les mots de passe ne correspondent pas.");
      seterror(true);
      return;
    }
    if (!verify1 || !verify2 || !verify3 || !verify4 || !verify5) {
      seterrorMessage("Le mot de passe ne respecte pas les critères.");
      seterror(true);
      return;
    }

    try {
      const formDataToSend = new FormData();
      console.log("Données du formulaire:", formData);
      console.log("Photo de profil:", avatar.file);

      // Ajout des champs texte
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

      const response = await fetch("http://localhost:5000/users/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
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
        autoClose: 2000,
      });

      // Redirection après inscription réussie
      setUser(true);
      navigate("/publication");
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      seterrorMessage("Une erreur s'est produite lors de l'inscription");
      seterror(true);
      toast.error("Erreur lors de l'inscription");
    }
  };
  return (
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
                autoComplete=""
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
                autoComplete=""
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
                  id={`password-${passwordId}`}
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
                          showPassword1 ? "hide the password" : "show password"
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
                <Link to={"/login"}>connectez-vous</Link>{" "}
              </span>
            </p>
          </div>
          <div className="verification">
            {contraint && (
              <div className="">
                <p>
                  {verify1 ? (
                    <FaCheck style={{ color: "green", fontSize: "24px" }} />
                  ) : (
                    <Cancel style={{ color: "red", fontSize: "24px" }} />
                  )}
                  au moins 8 lettres.
                </p>
                <p>
                  {verify2 ? (
                    <FaCheck style={{ color: "green", fontSize: "24px" }} />
                  ) : (
                    <Cancel style={{ color: "red", fontSize: "24px" }} />
                  )}
                  au moins 1 chiffre.
                </p>
                <p>
                  {verify3 ? (
                    <FaCheck style={{ color: "green", fontSize: "24px" }} />
                  ) : (
                    <Cancel style={{ color: "red", fontSize: "24px" }} />
                  )}
                  au moins 1 majuscule.
                </p>
                <p>
                  {verify4 ? (
                    <FaCheck style={{ color: "green", fontSize: "24px" }} />
                  ) : (
                    <Cancel style={{ color: "red", fontSize: "24px" }} />
                  )}
                  au moins 1 miniscule.
                </p>
                <p>
                  {verify5 ? (
                    <FaCheck style={{ color: "green", fontSize: "24px" }} />
                  ) : (
                    <Cancel style={{ color: "red", fontSize: "24px" }} />
                  )}
                  au moins 1 caractère special.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Connexion;
