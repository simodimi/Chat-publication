import React, { useRef } from "react";
import "./status.css";
import { TbPointFilled } from "react-icons/tb";
import { IoSend } from "react-icons/io5";
import { FaPause, FaPlay, FaMicrophone, FaStop } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { useState, useEffect } from "react";

const Audio = ({ onSave }) => {
  const [seeSecondary, setSeeSecondary] = useState(true);
  const [loading, setLoading] = useState(false); //statut de chargement de l'audio
  const [seegeneral, setSeegeneral] = useState(false);
  const [statutpauseLogo, setStatutPauseLogo] = useState(false); //statut pour afficher les logos de pause et de lecture de statut pause
  const [statutrecorder, setStatutRecorder] = useState(false); //statut de l'enregistrement par un point vert
  const [statutpause, setStatutPause] = useState(false); // soit en pause soit en lecture
  const [timer, setTimer] = useState(0); // compteur de l'enregistrement
  const [startAudio, setStartAudio] = useState(true); //lancer l'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showAudioCanvas, setShowAudioCanvas] = useState(false);
  //const [progress, setProgress] = useState(0); //progression de l'enregistrement
  //références pour objet audio
  const audioContextRef = useRef(null); //garder une instance d'audioContext qui permet de traiter et manipuler le flux audio.
  const analyserRef = useRef(null); //garder une instance pour analyser l'audio(obtenir les fréquences audio).
  const canvasRef = useRef(null); //garder une instance pour le canvas ,barre laterale.
  const mediaRecorderRef = useRef(null); //garder une instance de mediaRecorder pour  enregistrer l'audio provenant du microphone.
  const chunksRef = useRef([]); //garder les morceaux d'audio enregistré.
  const [audioURL, setAudioURL] = useState(null); //url de l'audio enregistré.
  const timerRef = useRef(null); //permet de garder la valeur du temps entre les rendus sans avoir besoin de la stocker dans l'état

  //compteur de l'enregistrement
  useEffect(() => {
    let timing = timerRef.current;
    if (statutpause) {
      timing = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timing);
    }
    return () => {
      clearInterval(timing);
    };
  }, [statutpause]);
  //lancer l'audio
  const StartAudio = () => {
    setStatutPause(true);
    setStartAudio(false);
    setStatutPauseLogo(true);
    setStatutRecorder(true);
    startRecording();
  };
  //pause de l'audio
  const PauseAudio = () => {
    setStatutPause(false);
  };
  //continuer l'audio
  const ContinueAudio = () => {
    setStatutPause(true);
  };
  //supprimer l'audio

  const ondeleteAudio = () => {
    setTimer(0);
    setStatutPause(false);
    setStatutRecorder(false);
    setAudioURL(null);
    stopRecording();
    timerRef.current = 0;
  };
  //suivre son audio
  const showrecorder = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    //creer une url a partir des morceaux d'audio enregistré
    const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    setSeeSecondary(false);
    setTimeout(() => {
      setAudioURL(audioUrl);
      setLoading(false);
      setSeegeneral(true);
    }, 1000);
    stopRecording();
    //remettre les valeurs par defaut
    setStatutPause(false);
    setStartAudio(true);
    setStatutPauseLogo(false);
    setStatutRecorder(false);
    timerRef.current = 0;
  };
  //supprimer l'audio prepublier
  const ondeleteAudios = () => {
    setAudioURL(null);
    setSeegeneral(false);
    setSeeSecondary(true);
  };
  //fonction asynchrone de démarrage de l'enregistrement
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/mp3" });
        setAudioBlob(URL.createObjectURL(blob));
        setIsRecording(false);
        stopTimer();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
      visualizeAudio();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  //fonction pour arreterl'enregistrement
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  //dessin en 2d des données audio
  //fonction pour visualiser les donnes audio en temps reel
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

  // Gestion du timer
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

  // Formater le temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Sauvegarder l'enregistrement
  const saveRecording = () => {
    if (audioBlob) {
      onSave({
        type: "audio",
        content: audioBlob,
        duration: formatTime(timer),
        timestamp: new Date(),
      });
      deleteRecording();
    }
  };

  // Supprimer l'enregistrement
  const deleteRecording = () => {
    setAudioBlob(null);
    setShowAudioCanvas(false);
    setTimer(0);
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  return (
    <>
      <div className="ReadAudio">
        <div className="" id="ReadAudio">
          <div className="" id="SubReadAudio">
            {seegeneral && (
              <>
                <div className="CallOption">
                  <p>
                    <span className="ButtonMenu" onClick={ondeleteAudios}>
                      supprimer
                    </span>
                    <label>Supprimer</label>
                  </p>
                </div>
                <div className="Showrecorder">
                  {loading ? (
                    <div className="loading">
                      <div className="loader"></div>
                    </div>
                  ) : (
                    audioURL && <audio src={audioURL} controls />
                  )}
                </div>
              </>
            )}
            {seeSecondary && (
              <>
                <p>
                  {!statutrecorder ? (
                    <span className="ButtonMenu">
                      <TbPointFilled />
                    </span>
                  ) : (
                    <span className="ButtonMenu">
                      <TbPointFilled style={{ color: "green" }} />
                    </span>
                  )}
                  <span className="ButtonMenu">
                    <canvas ref={canvasRef} width="150" height="50"></canvas>
                  </span>
                  <span className="ButtonMenu">
                    {Math.floor(timer / 60) < 10 ? "0" : ""}
                    {Math.floor(timer / 60)}:
                    {Math.floor(timer % 60) < 10 ? "0" : ""}
                    {Math.floor(timer % 60)}
                  </span>

                  <span className="ButtonMenu">
                    {" "}
                    <IoSend onClick={showrecorder} />
                  </span>
                </p>
                <div className="CallOption">
                  {startAudio && (
                    <p>
                      <span className="ButtonMenu">
                        <FaMicrophone />
                      </span>
                      <label>Démarrer</label>
                    </p>
                  )}
                  {statutpauseLogo && (
                    <>
                      {isRecording ? (
                        <>
                          <button
                            onClick={stopRecording}
                            className="audio-button"
                          >
                            <FaStop /> Arrêter
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={startRecording}
                            className="audio-button"
                          >
                            <FaMicrophone /> Démarrer
                          </button>
                        </>
                      )}
                    </>
                  )}
                  <p>
                    <span className="ButtonMenu">
                      <RiDeleteBin3Fill onClick={ondeleteAudio} />
                    </span>
                    <label>supprimer</label>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {audioBlob && (
        <div className="audio-preview">
          <audio src={audioBlob} controls />
          <button onClick={saveRecording} className="save-audio-button">
            Envoyer
          </button>
        </div>
      )}
    </>
  );
};

export default Audio;
