/**
 * Composant SelfieViedo - Permet de capturer des vidéos selfie pour les statuts
 * @param {Function} setMenuaction - Fonction pour gérer l'état du menu
 * @param {boolean} menuaction - État du menu
 * @param {boolean} SeeButton - État de visibilité du bouton
 * @param {Function} setSeeButton - Fonction pour gérer la visibilité du bouton
 */
import React, { useState, useRef, useEffect } from "react";
import "./status.css";

const SelfieViedo = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
}) => {
  // Références pour la vidéo et le canvas
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // États pour gérer l'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timer, setTimer] = useState(0);

  /**
   * Démarre la caméra
   */
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        setIsRecording(false);
        setTimer(0);
      };
    } catch (error) {
      console.error("Erreur lors du démarrage de la caméra:", error);
    }
  };

  /**
   * Démarre l'enregistrement
   */
  const startRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "inactive"
    ) {
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimer(0);
    }
  };

  /**
   * Arrête l'enregistrement
   */
  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  /**
   * Réinitialise l'enregistrement
   */
  const resetRecording = () => {
    setRecordedVideo(null);
    setTimer(0);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  /**
   * Sauvegarde la vidéo
   */
  const saveVideo = () => {
    if (recordedVideo) {
      // Ici, vous pouvez implémenter la logique pour sauvegarder la vidéo
      console.log("Vidéo sauvegardée:", recordedVideo);
      setMenuaction(false);
      setSeeButton(false);
    }
  };

  // Effet pour gérer le timer pendant l'enregistrement
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="WriteSmsCallx">
      {/* Zone d'affichage de la vidéo */}
      <div className="showScreenx">
        {recordedVideo ? (
          <video src={recordedVideo} controls className="showScreenVideo" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="showScreenVideo"
          />
        )}
      </div>

      {/* Contrôles de la caméra */}
      <div className="camera-controls">
        {!recordedVideo ? (
          <>
            {!isRecording ? (
              <button onClick={startRecording} className="ButtonMenu">
                Démarrer l'enregistrement
              </button>
            ) : (
              <button onClick={stopRecording} className="ButtonMenu">
                Arrêter l'enregistrement
              </button>
            )}
            <span className="timer">{timer}s</span>
          </>
        ) : (
          <>
            <button onClick={saveVideo} className="ButtonMenu">
              Sauvegarder
            </button>
            <button onClick={resetRecording} className="ButtonMenu">
              Réessayer
            </button>
          </>
        )}
      </div>

      {/* Bouton pour démarrer la caméra */}
      {!videoRef.current?.srcObject && (
        <button onClick={startCamera} className="ButtonMenu">
          Démarrer la caméra
        </button>
      )}
    </div>
  );
};

export default SelfieViedo;
