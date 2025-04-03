import React, { useRef } from "react";
import "./status.css";
import { FaPause, FaPlay, FaMicrophone, FaStop } from "react-icons/fa";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

const Audio = ({ onSave, setPublication }) => {
  const [timer, setTimer] = useState(0); // compteur de l'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showAudioCanvas, setShowAudioCanvas] = useState(false);
  //const [progress, setProgress] = useState(0); //progression de l'enregistrement
  //références pour objet audio
  const canvasRef = useRef(null); //garder une instance pour le canvas ,barre laterale.
  const mediaRecorderRef = useRef(null); //garder une instance de mediaRecorder pour  enregistrer l'audio provenant du microphone.
  const chunksRef = useRef([]); //garder les morceaux d'audio enregistré.
  const timerRef = useRef(null); //permet de garder la valeur du temps entre les rendus sans avoir besoin de la stocker dans l'état
  const [isPaused, setIsPaused] = useState(false);

  //supprimer l'audio✏️

  const deleteRecording = () => {
    setAudioBlob(null);
    setShowAudioCanvas(false); //supprimer le canvas
    setTimer(0); //supprimer le compteur
    setIsPaused(false);
    //supprimer les morceaux d'audio
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };
  /*const showaudio = () => {
    setShowAudioCanvas((prev) => !prev);
    if (!showAudioCanvas) {
      // Réinitialiser les états lors de l'ouverture
      setAudioBlob(null);
      setTimer(0);
      setIsPaused(false);
      setIsRecording(false);
    }
  };*/
  //fonction asynchrone de démarrage de l'enregistrement✏️
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      }); //activer le microphone
      mediaRecorderRef.current = new MediaRecorder(stream); //créer un objet mediaRecorder
      chunksRef.current = []; //créer un tableau pour stocker les morceaux d'audio

      mediaRecorderRef.current.ondataavailable = (e) => {
        //traiter les morceaux d'audio
        if (e.data.size > 0) {
          //si le morceau d'audio est disponible
          chunksRef.current.push(e.data); //ajouter le morceau d'audio au tableau
        }
      };

      mediaRecorderRef.current.onstop = () => {
        //quand l'enregistrement est terminé
        const blob = new Blob(chunksRef.current, { type: "audio/mp3" }); //créer un objet blob avec les morceaux d'audio
        setAudioBlob(URL.createObjectURL(blob)); //mettre l'url de l'audio enregistré
        setIsRecording(false); //arreter l'enregistrement
        stopTimer(); //arreter le compteur
        stream.getTracks().forEach((track) => track.stop()); //arrêter tous les tracks du stream
      };

      mediaRecorderRef.current.start(); //demarrer l'enregistrement
      setIsRecording(true); //mettre l'enregistrement en cours
      startTimer(); //demarrer le compteur
      visualizeAudio(); //visualiser l'enregistrement
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error); //afficher l'erreur
    }
  };

  //fonction pour arreterl'enregistrement ✏️
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  //dessin en 2d des données audio
  //fonction pour visualiser les donnes audio en temps reel ✏️
  const visualizeAudio = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(
      mediaRecorderRef.current.stream
    );
    source.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;

      requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Effacer le canvas
      ctx.fillStyle = "#f5f5f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner des cercles concentriques
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) - 10;

      for (let i = 0; i < bufferLength; i++) {
        const radius = (dataArray[i] / 255) * maxRadius;

        // Créer un dégradé pour chaque cercle
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        gradient.addColorStop(
          0,
          `rgba(25, 118, 210, ${0.8 - i / bufferLength})`
        );
        gradient.addColorStop(
          1,
          `rgba(100, 181, 246, ${0.2 - i / bufferLength})`
        );

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.strokeStyle = `rgba(25, 118, 210, ${0.3 - i / bufferLength})`;
        ctx.stroke();
      }

      // Dessiner des barres verticales sur les côtés
      const barWidth = 4;
      const barSpacing = 2;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        // Barre gauche
        ctx.fillStyle = `rgba(25, 118, 210, ${0.8 - i / bufferLength})`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        // Barre droite
        ctx.fillStyle = `rgba(100, 181, 246, ${0.8 - i / bufferLength})`;
        ctx.fillRect(
          canvas.width - x - barWidth,
          canvas.height - barHeight,
          barWidth,
          barHeight
        );

        x += barWidth + barSpacing;
      }
    };

    draw();
  };

  // Gestion du timer✏️
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Formater le temps✏️
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs //afficher le temps
      .toString()
      .padStart(2, "0")}`;
  };

  // Sauvegarder l'enregistrement
  /*const saveRecording = () => {
    if (audioBlob) {
      onSave({
        type: "audio",
        content: audioBlob,
        duration: formatTime(timer),
        timestamp: new Date(),
      });
      deleteRecording();
    }
  };*/
  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
    }
  };
  const refimage = useRef(null);
  const handlechoicephoto = () => {
    refimage.current.click();
  };
  const [selectedImage, setselectedImage] = useState(null);
  const otherAudio = () => {
    setselectedImage(true);
    timerRef.current = null;
    deleteRecording();
  };
  useEffect(() => {
    if (audioBlob) {
      setPublication(true);
    } else {
      setPublication(false);
    }
  }, [audioBlob]);

  return (
    <div className="WriteSmsCalles">
      <div className="showScreens" ref={refimage}>
        {selectedImage ? (
          <div className="audioMenu">
            <div className="LaunchAudios">
              {audioBlob && (
                <div className="audioPreviews">
                  <audio src={audioBlob} controls />
                </div>
              )}
              <div className="AudioHeaders">
                <div className="audioControls">
                  {!isRecording ? (
                    <div className="CallOption" onClick={startRecording}>
                      <p>
                        {" "}
                        <span className="ButtonMenu">
                          {" "}
                          <FaMicrophone color=" #1976d2" />
                        </span>
                        <label> Démarrer</label>
                      </p>
                    </div>
                  ) : (
                    <>
                      {isPaused ? (
                        <div className="CallOption" onClick={resumeRecording}>
                          <p>
                            {" "}
                            <span className="ButtonMenu">
                              {" "}
                              <FaPlay color=" green" />
                            </span>
                            <label> Reprendre</label>
                          </p>
                        </div>
                      ) : (
                        <div className="CallOption" onClick={pauseRecording}>
                          <p>
                            {" "}
                            <span className="ButtonMenu">
                              {" "}
                              <FaPause color=" #1976d2" />
                            </span>
                            <label> Pause</label>
                          </p>
                        </div>
                      )}
                      <div className="CallOption" onClick={stopRecording}>
                        <p>
                          {" "}
                          <span className="ButtonMenu">
                            {" "}
                            <FaStop color="tomato" />
                          </span>
                          <label> Arrêter</label>
                        </p>
                      </div>
                    </>
                  )}

                  <div className="CallOption" onClick={deleteRecording}>
                    <p>
                      {" "}
                      <span className="ButtonMenu">
                        {" "}
                        <MdDelete color="red" />
                      </span>
                      <label>Supprimer</label>
                    </p>
                  </div>
                </div>
                <canvas ref={canvasRef} className="audioCanvas" />
                <div className="audioTimers">{formatTime(timer)}</div>
              </div>
            </div>
          </div>
        ) : (
          <p>Lancer un voice...</p>
        )}
      </div>

      <div className="AddPicturesPhoto" onClick={handlechoicephoto}>
        <>
          {!selectedImage ? (
            <span onClick={() => setselectedImage(true)}>
              faire un enregistrement
            </span>
          ) : (
            <span onClick={otherAudio}>Remplacer l'enregistrement</span>
          )}
        </>
      </div>
    </div>
  );
};

export default Audio;
