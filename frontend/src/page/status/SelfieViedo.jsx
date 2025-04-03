import React, { useState, useRef, useEffect } from "react";
import "./status.css";
import { FaMicrophone, FaPause, FaPlay, FaStop, FaVideo } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const SelfieViedo = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
}) => {
  // Références pour la vidéo et le canvas
  const videoRef = useRef(null);
  // const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // États pour gérer l'enregistrement
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  /**
   * Démarre la caméra
   */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      });
      videoRef.current.srcObject = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus",
      });
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
        //setIsRecording(false);
        stopTimer();
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      //setIsRecording(true);
      setIsRecording(false);
      startTimer();
      setIsPaused(false);
    } catch (error) {
      console.error("Erreur lors du démarrage de la caméra:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(true);
    setRecordedVideo(null); //
    document.querySelector(".videoHeaders").style.display = "none";

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const [selectedImage, setselectedImage] = useState(false);
  const otherAudio = () => {
    setRecordedVideo(null);
    // setselectedImage(true);
    setIsRecording(true);
    document.querySelector(".videoHeaders").style.display = "block";
    setTimer(0);
  };
  const handlestartvideo = () => {
    setRecordedVideo(null);
    setselectedImage(true);
    setIsRecording(true); //false
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

  const deleteRecording = () => {
    setRecordedVideo(null);
    setTimer(0);
    setIsPaused(false);
    setselectedImage(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isPaused === false) {
      mediaRecorderRef.current.pause();
      setIsPaused(true); //true
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

  return (
    <div className="WriteSmsCalles">
      <div className="showScreens" style={{ position: "relative" }}>
        {selectedImage ? (
          <div className="audioMenu" style={{ position: "relative" }}>
            <div className="LaunchAudios" style={{ position: "relative" }}>
              {recordedVideo ? (
                <video
                  src={recordedVideo}
                  controls
                  className="showScreenVideos"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="showSreamVideo"
                />
              )}
              {/*isRecording ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="showSreamVideo"
                />
              ) : recordedVideo ? (
                <video
                  src={recordedVideo}
                  controls
                  className="showScreenVideos"
                />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="showSreamVideo"
                />
              )*/}
              <div className="videoHeaders">
                <div className="controlsvideoscream">
                  <div className="audioControls">
                    {isRecording ? (
                      <div className="CallOption" onClick={startRecording}>
                        <p>
                          <span className="ButtonMenu">
                            <FaVideo color=" #1976d2" />
                          </span>
                          <label> Démarrer</label>
                        </p>
                      </div>
                    ) : (
                      <>
                        {isPaused ? (
                          <div className="CallOption" onClick={resumeRecording}>
                            <p>
                              <span className="ButtonMenu">
                                <FaPlay color=" green" />
                              </span>
                              <label> Reprendre</label>
                            </p>
                          </div>
                        ) : (
                          <div className="CallOption" onClick={pauseRecording}>
                            <p>
                              <span className="ButtonMenu">
                                <FaPause color=" #1976d2" />
                              </span>
                              <label> Pause</label>
                            </p>
                          </div>
                        )}
                        <div className="CallOption" onClick={stopRecording}>
                          <p>
                            <span className="ButtonMenu">
                              <FaStop color="tomato" />
                            </span>
                            <label> Arrêter</label>
                          </p>
                        </div>
                      </>
                    )}

                    <div className="CallOption" onClick={deleteRecording}>
                      <p>
                        <span className="ButtonMenu">
                          <MdDelete color="red" />
                        </span>
                        <label>Supprimer</label>
                      </p>
                    </div>
                  </div>

                  <div className="audioTimers">{formatTime(timer)}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>prendre une vidéo...</p>
        )}
      </div>
      <div className="AddPicturesPhoto">
        <>
          {!recordedVideo ? (
            <span onClick={handlestartvideo}>
              faire un enregistrement vidéo
            </span>
          ) : (
            <span onClick={otherAudio}>Remplacer l'enregistrement</span>
          )}
        </>
      </div>
    </div>
  );
};

export default SelfieViedo;
