import React from "react";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { background } from "./test";

const Selfie = ({ setMenuaction, setPublication, setSeeButton }) => {
  // État pour stocker l'image du selfie
  const [selfie, setSelfie] = useState(null);
  // État pour gérer le flux vidéo de la caméra
  const [stream, setStream] = useState(null);
  const [launch, setLaunch] = useState(false);
  // Références pour accéder aux éléments DOM de la vidéo et du canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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
    document.querySelector(".showScreens").style.display = "block";
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
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  };
  useEffect(() => {
    if (selfie) {
      setPublication(true);
    } else {
      setPublication(false);
    }
  }, [selfie]);

  const handleselection = () => {
    setLaunch(true);
  };
  return (
    <div className="WriteSmsCalles">
      {/* Zone d'affichage du selfie */}
      <div className="showScreens" style={{ position: "relative" }}>
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
        <div className="showScreenVideo">
          <video
            ref={videoRef}
            style={{ display: selfie ? "none" : "block" }}
          />
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="AddPicturesPhoto">
        {!selfie ? (
          !stream ? (
            <span onClick={startCamera}> Faire un selfie</span>
          ) : (
            <span onClick={captureSelfie}> 📸 Capturer</span>
          )
        ) : (
          <span
            onClick={() => {
              setSelfie(null);
              startCamera();
            }}
          >
            Prendre à nouveau un selfie
          </span>
        )}
      </div>
    </div>
  );
};

export default Selfie;
