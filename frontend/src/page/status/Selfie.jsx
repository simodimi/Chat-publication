/**
 * Composant Selfie - Gère la capture de selfies avec la caméra
 * @param {Function} setMenuaction - Fonction pour gérer l'état du menu
 * @param {boolean} menuaction - État du menu
 * @param {boolean} SeeButton - État de visibilité du bouton
 * @param {Function} setSeeButton - Fonction pour gérer la visibilité du bouton
 */
import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { background } from "./test";

const Selfie = ({ setMenuaction, menuaction, SeeButton, setSeeButton }) => {
  // État pour stocker l'image du selfie
  const [selfie, setSelfie] = useState(null);
  // État pour gérer le flux vidéo de la caméra
  const [stream, setStream] = useState(null);
  // Références pour accéder aux éléments DOM de la vidéo et du canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /**
   * Démarre la caméra et configure le flux vidéo
   */
  const startCamera = async () => {
    try {
      // Demande l'accès à la caméra
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(newStream);
      // Affiche le flux vidéo dans l'élément video
      videoRef.current.srcObject = newStream;
      videoRef.current.play();
      //cacher le menu
      setMenuaction(false);
      setSeeButton(false);
      document.querySelector(".showScreenx").style.display = "none";
    } catch (error) {
      console.error("Erreur de la camera", error);
    }
  };

  /**
   * Capture une image depuis le flux vidéo
   */
  const captureSelfie = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Ajuste la taille du canvas à celle de la vidéo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Dessine l'image de la vidéo sur le canvas
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertit le contenu du canvas en URL de données d'image
    const imageData = canvas.toDataURL("image/png");
    setSelfie(imageData);
    document.querySelector(".showScreenx").style.display = "block";
    // Arrête la caméra après la capture
    stopCamera();
  };

  /**
   * Arrête le flux vidéo de la caméra
   */
  const stopCamera = () => {
    if (stream) {
      // Arrête tous les tracks du stream
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Effet pour nettoyer le stream de la caméra lors du démontage du composant
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="WriteSmsCallx">
      {/* Zone d'affichage du selfie */}
      <div className="showScreenx">
        {selfie ? (
          <img src={selfie} alt="Selfie" className="showScreenImg" />
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            Prendre un selfie...
          </p>
        )}
      </div>
      {/* Élément vidéo pour afficher le flux de la caméra */}
      <video
        ref={videoRef}
        style={{ display: selfie ? "none" : "block" }}
        className="showScreenVideo"
      />
      {/* Canvas caché pour capturer l'image */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Boutons conditionnels basés sur l'état de la caméra et du selfie */}
      {!selfie && !stream && (
        <div className="StartCamera">
          <button onClick={startCamera} className="ButtonMenu">
            Démarrer la caméra
          </button>
        </div>
      )}
      {stream && !selfie && (
        <div className="TakeCamera">
          <button onClick={captureSelfie} className="ButtonMenu">
            Prendre un selfie
          </button>
        </div>
      )}
      {selfie && (
        <button
          onClick={() => {
            setSelfie(null);
            startCamera();
          }}
          className="ButtonMenu"
        >
          Reprendre un selfie
        </button>
      )}
    </div>
  );
};

export default Selfie;
