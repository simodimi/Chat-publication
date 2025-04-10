import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import image from "../../assets/social.png";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./connexion.css";
import { toast } from "react-toastify";
import { useId } from "react";
import { OutlinedInput, InputLabel } from "@mui/material";
import { Link } from "react-router-dom";

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

const Login = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const passwordId = useId();
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email_utilisateur: "",
    password_utilisateur: "",
  });
  const navigate = useNavigate();
  // Vérifier si l'utilisateur est déjà connecté
  /*useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/publication");
    }
  }, [navigate]);*/

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    // Vérification des champs vides
    if (!formData.email_utilisateur || !formData.password_utilisateur) {
      setError(true);
      setErrorMessage("Tous les champs sont obligatoires");
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      // Envoi des données au serveur
      const response = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_utilisateur: formData.email_utilisateur,
          password_utilisateur: formData.password_utilisateur,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erreur du serveur:", data);
        setErrorMessage(data.message || "Erreur lors de la connexion");
        setError(true);
        toast.error(data.message || "Erreur de connexion");
        return;
      }

      // Construction de l'URL complète de la photo de profil
      const photo_profil = data.photo_profil
        ? `http://localhost:5000${data.photo_profil}`
        : null;

      console.log("Photo de profil reçue:", photo_profil);
      localStorage.setItem(
        "userData",
        JSON.stringify({ ...data, photo_profil })
      );
      console.log(
        "Données stockées dans localStorage:",
        JSON.parse(localStorage.getItem("userData"))
      );

      toast.success(`Bienvenue ${data.name_utilisateur}`);
      setUser(true);
      navigate("/publication");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setError(true);
      setErrorMessage("Une erreur est survenue lors de la connexion");
      toast.error("Erreur de connexion");
    }
  };

  return (
    <div className="identification">
      <div className="connexion">
        <form onSubmit={handleLogin}>
          <div className="connexionTitle">
            <p>Sim'Soxial</p>
            <img src={image} alt="" />
          </div>
          {error && <p id="error">{errorMessage}</p>}
          <div className="formulaire">
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
          </div>
          <div className="button">
            <button type="submit">Se connecter</button>
          </div>
          <div className="other">
            <p>
              vous n'avez pas un compte?{" "}
              <span>
                {" "}
                <Link to={"/inscription"}> inscrivez-vous</Link>{" "}
              </span>
            </p>
            <p>mot de passe oublie?</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
