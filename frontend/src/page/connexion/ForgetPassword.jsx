import React, { useState, useEffect, useRef, useCallback } from "react";
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

const ForgetPassword = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(300);
  const [intervals, setIntervals] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Fonction pour le temps restant
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
  };

  //declencher le timer
  useEffect(() => {
    if (step !== 2) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev >= 0) {
          console.log(prev - 1);

          return prev - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    if (!email) {
      setError(true);
      setErrorMessage("Veuillez entrer votre email");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email_utilisateur: email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      toast.success("Code envoyé avec succès", { autoClose: 1500 });

      setStep(2);
      //setIsTimerActive(true);
      //setTimer(300);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    if (!code) {
      setError(true);
      setErrorMessage("Veuillez entrer le code");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email_utilisateur: email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code invalide");
      }

      toast.success("Code vérifié avec succès");
      setStep(3);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    if (!newPassword || !confirmPassword) {
      setError(true);
      setErrorMessage("Veuillez remplir tous les champs");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(true);
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_utilisateur: email,
            code,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // throw new Error signifie:
        // si la réponse n'est pas correcte, on stoppe le code en cours
        //on envoie un sms d'erreur
        //on passe automatiquement à la partie catch

        throw new Error(data.message || "Erreur lors de la réinitialisation");
      }

      toast.success("Mot de passe réinitialisé avec succès");
      navigate("/login");
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="identification">
      <div className="connexion">
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="connexionTitle">
              <p>Sim'Soxial</p>
              <img src={image} alt="" />
            </div>
            {error && <p id="error">{errorMessage}</p>}
            <div className="formulaire">
              <div className="subform">
                <label htmlFor="">Email</label>
                <CustomTextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <p style={{ display: "flex", textAlign: "center" }}>
              Veuillez entrer votre adresse email pour recevoir un code de
              réinitialisation et consulter votre boite mail.
            </p>
            <div className="button">
              <button type="submit">Envoyer le code</button>
            </div>
            <div className="other">
              <p>
                Retour à la connexion?{" "}
                <span>
                  <Link to={"/"}>Connectez-vous</Link>
                </span>
              </p>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="connexionTitle">
              <p>Sim'Soxial</p>
              <img src={image} alt="" />
            </div>
            {error && <p id="error">{errorMessage}</p>}
            <div className="formulaire">
              <div className="subform">
                <label htmlFor="">Code de vérification</label>
                <CustomTextField
                  label="Code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  fullWidth
                />
              </div>
            </div>
            <div
              className="timer"
              style={{
                color: timer < 60 ? "red" : "white",
                textAlign: "center",
                margin: "10px 0",
                fontSize: "1.2em",
              }}
            >
              <span>Temps restant : {formatTime(timer)}</span>
            </div>
            <div className="button">
              <button type="submit">Vérifier le code</button>
            </div>
            <div className="other">
              <p>
                Vous n'avez pas reçu le code ?{" "}
                <span>
                  <button
                    onClick={handleSendCode}
                    style={{
                      background: "none",
                      border: "none",
                      color: "blue",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    Renvoyer
                  </button>
                </span>
              </p>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="connexionTitle">
              <p>Sim'Soxial</p>
              <img src={image} alt="" />
            </div>
            {error && <p id="error">{errorMessage}</p>}
            <div className="formulaire">
              <div className="subform">
                <label htmlFor="">Nouveau mot de passe</label>
                <FormControl variant="outlined" fullWidth {...textFieldStyles}>
                  <InputLabel htmlFor="new-password">Mot de passe</InputLabel>
                  <OutlinedInput
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Mot de passe"
                  />
                </FormControl>
              </div>
              <div className="subform">
                <label htmlFor="">Confirmer le mot de passe</label>
                <FormControl variant="outlined" fullWidth {...textFieldStyles}>
                  <InputLabel htmlFor="confirm-password">
                    Confirmer le mot de passe
                  </InputLabel>
                  <OutlinedInput
                    id="confirm-password"
                    type={showPassword1 ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword1}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirmer le mot de passe"
                  />
                </FormControl>
              </div>
            </div>
            <div className="button">
              <button type="submit">Réinitialiser le mot de passe</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
