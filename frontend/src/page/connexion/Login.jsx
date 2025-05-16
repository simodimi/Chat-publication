import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "../../context/AuthContext";

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
  inputLabelProps: {
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
      inputLabelProps={textFieldStyles.inputLabelProps}
      {...props}
    />
  );
};

const Login = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.email_utilisateur || !formData.password_utilisateur) {
      setError(true);
      setErrorMessage("Tous les champs sont obligatoires");
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_utilisateur: formData.email_utilisateur,
          password_utilisateur: formData.password_utilisateur,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur du serveur:", errorData);
        setErrorMessage(errorData.message || "Erreur lors de la connexion");
        setError(true);
        toast.error(errorData.message || "Erreur de connexion");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      // Construction de l'URL complète de la photo de profil
      const photo_profil = data.photo_profil
        ? `http://localhost:5000${data.photo_profil}`
        : null;

      const userData = { ...data, photo_profil };
      login(userData);
      setUser(true);
      toast.success(`Bienvenue ${data.name_utilisateur}`, {
        autoClose: 1500,
      });
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
            <p>
              <span>
                <Link to={"/forgetpassword"}>mot de passe oublie?</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
