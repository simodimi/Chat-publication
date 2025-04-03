import React from "react";
import { FaMicrophone, FaPause, FaPlay, FaStop } from "react-icons/fa";
import "./message.css";
import { MdEmojiEmotions } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { IoMdPhotos } from "react-icons/io";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState, useEffect, useRef } from "react";
import { TiThMenu } from "react-icons/ti";
import { GiCancel, GiCrossMark } from "react-icons/gi";
import { IoVideocam } from "react-icons/io5";
import { IoCall } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { person, personall } from "../groupe/Testgroup";
import { MdDelete } from "react-icons/md";
import { FaCopy } from "react-icons/fa";
import { MdQuestionAnswer } from "react-icons/md";
import MicRecorder from "mic-recorder-to-mp3";
import logo from "../../assets/social.png";
import Emoji from "../../component/Emoji";
import { CiMenuKebab } from "react-icons/ci";
import pdf from "../../assets/pdfnew.png";
import { FaCloudDownloadAlt } from "react-icons/fa";
import dossier from "../../assets/dossier.png";
import { useNavigate, useLocation } from "react-router-dom";

const recorder = new MicRecorder({ bitRate: 128 });
const Message = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedUser, returnToConversation } = location.state || {};
  //------------------------------------------------------
  //PARTIE GAUCHE/gestion des contacts et des recherches
  //------------------------------------------------------
  //état pour gérer l'utilisateur sélectionné
  const [SelectionUser, setSelectionUser] = useState(null);
  const [SelectionallUser, setSelectionallUser] = useState(null);
  //état pour gérer la recherche de groupe
  const [searchgroup, setSearchgroup] = useState("");
  const [searchallgroup, setSearchallgroup] = useState("");
  //état pour gérer les options du sms
  const [optionsms, setOptionsms] = useState(null);
  //références pour scroller
  const messageRefs = useRef({});

  //gestion de la recherche dans la liste des groupes
  const handleGroupChange = (e) => {
    setSearchgroup(e.target.value);
  };
  //filtre selon la recherche
  const filtergroup = person.filter((p) => {
    return p.title.toLowerCase().includes(searchgroup.toLowerCase());
  });
  //gestion de la recherche dans la liste de tous les groupes
  const handleGroupallChange = (e) => {
    setSearchallgroup(e.target.value);
  };
  //filtre de tous les groupes
  const filtergroupall = personall.filter((p) => {
    return p.title.toLowerCase().includes(searchallgroup.toLowerCase());
  });
  //activation et désactivation la sélection de l'user en appliquant un css
  const toggle = (id) => {
    setSelectionUser(id === SelectionUser ? id : id); //null:id
  };
  //action et desactivation de l'user
  const toggleall = (id) => {
    setSelectionallUser(id === SelectionallUser ? id : id); //null:id
  };

  //------------------------------------------------------
  //PARTIE GAUCHE/gestion de l'affichage de tous les contacts
  //------------------------------------------------------

  //états pour personnaliser l'affichager des boutons
  const [SelectionButton, setSelectionButton] = useState(true);
  const [ButtonClick, setButtonClick] = useState(false);
  const [SeeButton, setSeeButton] = useState(false);
  //references pour les clics à l'exterieur de leurs div

  const ref = useRef(null);
  //fonction pour gérer l'affichage du menu des contacts
  const handleChoiceButton = () => {
    setButtonClick(!ButtonClick);
    setSelectionButton(!SelectionButton);
    setSeeButton(!SeeButton);
  };
  //masquer la liste des contacts si on clique en dehors
  useEffect(() => {
    const handleDisappear = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        //si la ref  existe et si tu cliques en dehors
        setSeeButton(false);
        setSelectionButton(true);
      }
    };
    //ajout de l'ecouteur d'evenement
    document.addEventListener("mousedown", handleDisappear);
    return () => {
      //suppression de l'ecouteur d'evenement
      document.removeEventListener("mousedown", handleDisappear);
    };
  }, [ref]);

  //------------------------------------------------------
  //PARTIE Droite/gestion des messages
  //------------------------------------------------------

  const [iconevideo, setIconevideo] = useState(false);
  const [iconeappel, setIconeappel] = useState(false);
  const [showemojis, setshowemojis] = useState(false);
  const [audio, setAudio] = useState(false);
  const [send, setSend] = useState(true);
  const [empty, setEmpty] = useState(false);
  const [messageByUser, setMessagesByUser] = useState({});
  const emojiref = useRef(null);
  const buttonref = useRef(null);
  const refposition = useRef(null);

  //selection des user

  const [SelectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné
  useEffect(() => {
    if (refposition.current) {
      refposition.current.scrollIntoView({ behavior: "smooth" });
    } //si selectedUser n est pas null on renvoie l'id si non c'est indefini.
  }, [messageByUser[SelectedUser?.id]]); //se declencher à chaque mis à jour du message dans le tableau

  const handleshowEmoji = () => {
    setshowemojis((prev) => !prev);
  };
  useEffect(() => {
    const dissapear = (event) => {
      if (
        emojiref.current &&
        !emojiref.current.contains(event.target) &&
        buttonref.current &&
        !buttonref.current.contains(event.target)
      ) {
        setshowemojis(false);
      }
    };
    document.addEventListener("mousedown", dissapear);
    return () => {
      document.removeEventListener("mousedown", dissapear);
    };
  }, [emojiref]);
  //états pour gérer les messages
  //value du sms redigé
  const [message, setMessage] = useState("");
  const [messageReponse, setMessageReponse] = useState("");
  const [selectedmessage, setSelectedmessage] = useState(null);
  const handlewritemessage = (e) => {
    const free = e.target.value;
    if (copytext) {
      setMessageReponse(free);
    } else {
      setMessage(free);
    }
    //si le message est vide on ne peut pas envoyer(desarmer le bouton envoyer)
    setSend(free.trim() === ""); //si égalité on aura setsend(true)
  };
  //envoi d'un message
  const sendmessage = () => {
    //si l'utilisateur est null on ne peut pas envoyer de message
    if (!SelectedUser) return;
    const newMessage = {
      id: Date.now(), //un id unique
      text: copytext ? messageReponse : message,
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      //si on repond à un message on envoie l'id du message
      //selectedmessage?.id est l'id du message auquel on repond
      //id est la propriété de l'objet message
      replyTo: copytext ? selectedmessage?.id : null,
    };
    setMessagesByUser((prev) => ({
      ...prev,
      //si l'id de l'utilisateur est null on renvoie un tableau vide
      //si l'id de l'utilisateur est different de null on renvoie le tableau des messages de l'utilisateur
      //et on ajoute le nouveau message
      //selectedUser.id est l'id de l'utilisateur selectionné
      [SelectedUser.id]: [...(prev[SelectedUser.id] || []), newMessage],
    }));
    // Réinitialiser les champs après l'envoi
    setMessage("");
    setMessageReponse("");
    setSend(true);
    setcopytext(false);
    setafficheranswer([]);
    settableauAnswer([]);
  };
  const handleEmojiClick = (e) => {
    setMessage((prev) => prev + e.emoji);
    setSend(false);
  };

  // --------------------------------------------------------
  // GESTION DE LA SÉLECTION DES UTILISATEURS ET DES MESSAGES
  // --------------------------------------------------------

  // gérer la sélection d'un user et charger ses sms
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setEmpty(true);
  };

  // Effet pour sauvegarder les messages dans le localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("messages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessagesByUser(parsedMessages);
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
      }
    }
  }, []);

  // Effet pour sauvegarder les messages quand ils changent
  useEffect(() => {
    try {
      localStorage.setItem("messages", JSON.stringify(messageByUser));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des messages:", error);
    }
  }, [messageByUser]);

  // Effet pour gérer la redirection après un appel
  useEffect(() => {
    if (returnToConversation && selectedUser) {
      handleUserSelect(selectedUser);
      // Nettoyer l'état de navigation
      window.history.replaceState({}, document.title);
    }
  }, [returnToConversation, selectedUser]);

  // Effet pour charger les messages au démarrage
  useEffect(() => {
    const loadMessages = () => {
      const savedMessages = localStorage.getItem("messages");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          setMessagesByUser(parsedMessages);
        } catch (error) {
          console.error("Erreur lors du chargement des messages:", error);
        }
      }
    };

    loadMessages();
  }, []);

  // --------------------------------------------------------
  // GESTION DE LA SÉLECTION DES UTILISATEURS ET DES MESSAGES
  // --------------------------------------------------------
  //envoie des medias
  const mediaref = useRef(null);
  const handlemedia = () => {
    mediaref.current.click();
  };
  const handlemediachange = (e) => {
    if (!SelectedUser) return;
    const files = e.target.files[0];
    if (files) {
      const free = new FileReader();
      free.onloadend = () => {
        const newMediaMessage = {
          id: Date.now(), //un id unique
          data: free.result,
          type: files.type,
          name: files.name,
        };
        //ajouter des fichiers à la conversation
        setMessagesByUser((prev) => ({
          ...prev,
          [SelectedUser.id]: [
            ...(prev[SelectedUser.id] || []),
            newMediaMessage,
          ],
        }));
      };
      free.readAsDataURL(files);
    }
  };
  const MediaDisplay = ({ media }) => {
    if (media && media.type) {
      if (media.type.startsWith("image/")) {
        return <img src={media.data} alt="" className="media-image" />;
      } else if (media.type.startsWith("video/")) {
        return <video src={media.data} controls />;
      } else if (media.type.startsWith("audio/")) {
        return <audio src={media.data} controls />;
      } else if (media.type === "application/pdf") {
        return (
          <p>
            <a
              href={media.data}
              download="document.pdf"
              className="pdf-download-link"
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={dossier}
                  alt=""
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "transparent",
                  }}
                />
                <h6 style={{ margin: "0 10px" }}> {media.name}</h6>
                <FaCloudDownloadAlt style={{ color: "black" }} />{" "}
              </span>
            </a>
          </p>
        );
      } else if (
        media.type === "application/epub+zip" ||
        media.type === "application/x-mobipocket-ebook"
      ) {
        return (
          <p>
            <a
              href={media.data}
              download="ebook.epub"
              className="pdf-download-link"
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={dossier}
                  alt=""
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "transparent",
                  }}
                />
                <h6 style={{ margin: "0 10px" }}> {media.name}</h6>
                <FaCloudDownloadAlt style={{ color: "black" }} />{" "}
              </span>
            </a>
          </p>
        );
      } else if (media.type.startsWith("application/")) {
        return (
          <p>
            <a
              href={media.data}
              download="fichier"
              className="pdf-download-link"
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={dossier}
                  alt=""
                  style={{
                    display: "flex",
                    margin: "0",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    backgroundColor: "transparent",
                  }}
                />
                <h6 style={{ margin: "0 10px" }}> {media.name}</h6>
                <FaCloudDownloadAlt style={{ color: "black" }} />{" "}
              </span>
            </a>
          </p>
        );
      } else if (media.type.startsWith("text/plain")) {
        return <p>{media.data}</p>;
      } else if (
        media.type.startsWith("audio/") ||
        media.type === "audio/mp3"
      ) {
        return (
          <div className="audio-message">
            <audio src={media.data} controls className="audio-player" />
            {media.duration && (
              <span className="audio-duration">{media.duration}</span>
            )}
          </div>
        );
      } else {
      }
    } else {
      return null;
    }
  };
  //CLIC DROIT SUR LE MESSAGE
  const [clickdroit, setclickdroit] = useState(null);
  const handleContextMenu = (e, id) => {
    e.preventDefault();
    setclickdroit(id);
  };
  const refdroit = useRef(null);
  useEffect(() => {
    const disappear = (event) => {
      if (refdroit.current && !refdroit.current.contains(event.target)) {
        setclickdroit(null);
      }
    };

    document.addEventListener("click", disappear);
    return () => {
      document.removeEventListener("click", disappear);
    };
  }, []);
  //copy text
  const [copytext, setcopytext] = useState(false);
  const handlecopyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  //télecharger un fichier
  const handleDownload = (media) => {
    const link = document.createElement("a");
    link.href = media.data;
    link.download = media.name || "fichier";
    document.body.appendChild(link); //ajouter le lien au body
    link.click(); //cliquer sur le lien
    document.body.removeChild(link); //supprimer le lien
  };
  //supprimer un message
  const handleDelete = (id) => {
    if (!SelectedUser) return;
    setMessagesByUser((prev) => ({
      ...prev,
      [SelectedUser.id]:
        prev[SelectedUser.id]?.filter((item) => item.id !== id) || [],
    }));
    setclickdroit(null);
    setcopytext(false);
  };
  //repondre au message
  const handleRepondre = (message) => {
    setafficheranswer(true);
    setclickdroit(null);
    setcopytext(true);
    if (reffocus.current) {
      reffocus.current.focus();
    }

    // Gestion des différents types de messages
    if (message.type && message.type.startsWith("audio/")) {
      settextanswer("🎵 Message audio");
    } else if (message.type && message.type.startsWith("image/")) {
      settextanswer(message.data);
    } else if (message.type && message.type.startsWith("video/")) {
      settextanswer(message.data);
    } else if (message.type && message.type.startsWith("application/pdf")) {
      settextanswer(message.name);
    } else if (message.type && message.type.startsWith("application")) {
      settextanswer(message.name);
    } else if (message.text) {
      settextanswer(
        message.text.length <= 30
          ? message.text
          : message.text.slice(0, 50) + "..."
      );
    }
    setSelectedmessage(message);
  };
  const handledeleteanswer = (id) => {
    setcopytext(false);
  };
  const [tableauAnswer, settableauAnswer] = useState([]);
  const [afficheranswer, setafficheranswer] = useState([]);
  const [textanswer, settextanswer] = useState("");
  const reffocus = useRef(null);

  //audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [showAudioCanvas, setShowAudioCanvas] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

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

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

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

  const deleteRecording = () => {
    setAudioBlob(null);
    setShowAudioCanvas(false);
    setTimer(0);
    setIsPaused(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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
    analyser.fftSize = 256; // Augmenter pour plus de détails
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

  const sendAudioMessage = () => {
    if (!audioBlob || !SelectedUser) return;

    const newAudioMessage = {
      id: Date.now(),
      data: audioBlob,
      type: "audio/mp3",
      time: new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      duration: formatTime(timer),
      userStatus: "home",
    };

    setMessagesByUser((prev) => ({
      ...prev,
      [SelectedUser.id]: [...(prev[SelectedUser.id] || []), newAudioMessage],
    }));

    // Réinitialiser tous les états après l'envoi
    setAudioBlob(null);
    setShowAudioCanvas(false);
    setTimer(0);
    setIsPaused(false);
    setIsRecording(false);
  };
  // Créer une référence pour chaque message
  const messageRefids = useRef({});

  const handleScrollToOriginal = (originalMessageId) => {
    const originalMessageRef = messageRefids.current[originalMessageId];
    if (originalMessageRef) {
      originalMessageRef.scrollIntoView({ behavior: "smooth" });
    }
  };
  const showaudio = () => {
    setShowAudioCanvas((prev) => !prev);
    if (!showAudioCanvas) {
      // Réinitialiser les états lors de l'ouverture
      setAudioBlob(null);
      setTimer(0);
      setIsPaused(false);
      setIsRecording(false);
    }
  };

  const handleCall = (type) => {
    if (SelectedUser) {
      navigate("/call", { state: { type, user: SelectedUser } });
    }
  };

  return (
    <div className="MessageHome">
      <div className="MessageHomeLeft">
        <div
          className=""
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p id="Appel">Discussions</p>
          <div className="">
            <span
              style={{ marginRight: "10px" }}
              className={`ButtonMenu ${ButtonClick ? "activeMenu" : ""}  `}
              onClick={() => handleChoiceButton()}
            >
              {SelectionButton ? <TiThMenu /> : <GiCrossMark />}
            </span>
            {SeeButton && (
              <div className="AfficherContact" ref={ref}>
                <div className="HideContact">
                  <p style={{ textAlign: "center", fontWeight: "bold" }}>
                    Nouvelle discussion
                  </p>

                  <Box className="SearchCommunication">
                    <TextField
                      helperText=" "
                      className="SearchCommunicationInput"
                      id="demo-helper-text-aligned-no-helper"
                      label="Rechercher un nom de contact"
                      type="search"
                      value={searchallgroup}
                      onChange={handleGroupallChange}
                    />
                  </Box>
                  <div className="DiscussionList">
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      Tous les contacts
                    </p>
                    <div className="GroupeSearch">
                      {filtergroupall.length > 0 ? (
                        filtergroupall.map((p) => (
                          <div
                            className={`AppelContacts ${
                              SelectionallUser === p.id ? "Appelselects" : ""
                            } `}
                            style={{ display: "flex" }}
                            onClick={() => {
                              toggleall(p.id);
                            }}
                            key={p.id}
                          >
                            <div className="AppelContactImg">
                              <img src={p.photo} alt="" />
                            </div>
                            <div className="AppelName">
                              <div className="AppelNameLeft">
                                <p>{p.title} </p>
                                <p className="last-message">
                                  {messageByUser[p.id] &&
                                  messageByUser[p.id].length > 0
                                    ? messageByUser[p.id][
                                        messageByUser[p.id].length - 1
                                      ].type.startsWith("text")
                                      ? messageByUser[p.id][
                                          messageByUser[p.id].length - 1
                                        ].text
                                      : messageByUser[p.id][
                                          messageByUser[p.id].length - 1
                                        ].type.startsWith("image")
                                      ? "📷 Image"
                                      : messageByUser[p.id][
                                          messageByUser[p.id].length - 1
                                        ].type.startsWith("video")
                                      ? "🎥 Vidéo"
                                      : messageByUser[p.id][
                                          messageByUser[p.id].length - 1
                                        ].type.startsWith("audio")
                                      ? "🎵 Audio"
                                      : "📄 Fichier"
                                    : "Aucun message"}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          Aucun groupe trouvé
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher une discussion"
            type="search"
            value={searchgroup}
            onChange={handleGroupChange}
          />
        </Box>
        <div className="ShowAppel">
          <div className="AppelContact">
            <div className="GroupeSearch">
              {filtergroup.length > 0 ? (
                filtergroup.map((p) => (
                  <div
                    className={`AppelContacts ${
                      SelectionUser === p.id ? "Appelselects" : ""
                    } `}
                    style={{ display: "flex" }}
                    onClick={() => {
                      toggle(p.id);
                      handleUserSelect(p);
                    }}
                    key={p.id}
                  >
                    <div className="AppelContactImg">
                      <img src={p.photo} alt="" />
                    </div>
                    <div className="AppelName">
                      <div className="AppelNameLeft">
                        <p>{p.title} </p>
                        <p className="last-message">
                          {messageByUser[p.id] && messageByUser[p.id].length > 0
                            ? messageByUser[p.id][
                                messageByUser[p.id].length - 1 //dernier message
                              ].type.startsWith("text")
                              ? messageByUser[p.id][
                                  messageByUser[p.id].length - 1
                                ].text
                              : messageByUser[p.id][
                                  messageByUser[p.id].length - 1
                                ].type.startsWith("image")
                              ? "📷 Image"
                              : messageByUser[p.id][
                                  messageByUser[p.id].length - 1
                                ].type.startsWith("video")
                              ? "🎥 Vidéo"
                              : messageByUser[p.id][
                                  messageByUser[p.id].length - 1
                                ].type.startsWith("audio")
                              ? "🎵 Audio"
                              : "📄 Fichier"
                            : "Aucun message"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Aucun groupe trouvé
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="MessageHomeRight">
        {empty ? (
          <div className="MessageGeneral">
            <div className="MessageHomeRightTitle">
              <div className="MessageTitleUser" id="onLine">
                {SelectedUser && (
                  <>
                    <img src={SelectedUser.photo} alt="" />
                    <p>{SelectedUser.title} </p>
                  </>
                )}
              </div>

              <div className="MessageTitleUserOption">
                <div id="optionMain">
                  <div
                    className="CallOption"
                    onClick={() => handleCall("video")}
                  >
                    <p>
                      <span className="ButtonMenu">
                        {iconevideo ? (
                          <IoVideocam color="gray" />
                        ) : (
                          <IoVideocam />
                        )}
                      </span>
                      <label>vidéo</label>
                    </p>
                  </div>
                  <div
                    className="CallOption"
                    onClick={() => handleCall("audio")}
                  >
                    <p>
                      <span className="ButtonMenu">
                        {iconeappel ? <IoCall color="gray" /> : <IoCall />}
                      </span>
                      <label>appel</label>
                    </p>
                  </div>
                </div>
                <div className="CallOption">
                  <p>
                    <span className="ButtonMenu">
                      <IoSearch />
                    </span>
                    <label>recherche </label>
                  </p>
                </div>

                <div className="CallOption">
                  <p>
                    <span className="ButtonMenu">
                      <CiMenuKebab />
                    </span>
                    <label>menu </label>
                  </p>
                </div>
              </div>
            </div>

            <div className="MessageHomeText">
              {/* Afficher tous les messages dans l'ordre chronologique */}
              {(messageByUser[SelectedUser?.id] || [])
                .sort((a, b) => {
                  // Convertir les timestamps en objets Date pour la comparaison
                  const timeA = new Date(a.time);
                  const timeB = new Date(b.time);
                  return timeA - timeB;
                })
                .map((message, index) => {
                  if (message.replyTo) {
                    // C'est une réponse
                    const originalMessage =
                      //si l'id de l'utilisateur est null on renvoie un tableau vide
                      (messageByUser[SelectedUser?.id] || [])
                        //permet de recuperer le message original
                        .find((p) => p.id === message.replyTo);

                    return (
                      <div
                        className={`HomeAnswer ${
                          //si le message est away on renvoie away sinon home
                          //userStatus est une propriété de l'objet message
                          message.userStatus === "away" ? "away" : "home"
                        }`}
                        key={message.id || index}
                        onClick={() => handleScrollToOriginal(message.replyTo)}
                      >
                        <div className="HomeAnswerOriginal">
                          {originalMessage?.type &&
                          originalMessage.type.startsWith("audio/") ? (
                            <div className="audio-preview-small">
                              <audio src={originalMessage.data} controls />
                              {originalMessage.duration && (
                                <span className="audio-duration-small">
                                  {originalMessage.duration}
                                </span>
                              )}
                            </div>
                          ) : originalMessage?.type &&
                            originalMessage.type.startsWith("image/") ? (
                            <img
                              src={originalMessage.data}
                              alt="Message original"
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : originalMessage?.type &&
                            originalMessage.type.startsWith("video/") ? (
                            <video
                              src={originalMessage.data}
                              controls
                              style={{ maxWidth: "50px", maxHeight: "50px" }}
                            />
                          ) : originalMessage?.type &&
                            originalMessage.type.endsWith(".pdf") ? (
                            <a
                              href={originalMessage.data}
                              download={originalMessage.name}
                            >
                              <img
                                src={pdf}
                                alt="PDF"
                                style={{ width: "20px", height: "20px" }}
                              />
                            </a>
                          ) : (
                            <h6>
                              {originalMessage?.text?.length <= 50
                                ? originalMessage.text
                                : originalMessage.text.slice(0, 50) + "..."}
                            </h6>
                          )}
                        </div>
                        <div className="HomeAnswerText">
                          <p>{message.text}</p>
                          <span>{message.time}</span>
                        </div>
                      </div>
                    );
                  } else {
                    // C'est un message original
                    return (
                      <div
                        key={message.id || index}
                        className={`SmsHome ${
                          message.userStatus === "away" ? "away" : "home"
                        }`}
                        onContextMenu={(e) => handleContextMenu(e, message.id)}
                        ref={(e) => (messageRefids.current[message.id] = e)}
                      >
                        <div className="media">
                          <MediaDisplay media={message} />
                        </div>

                        {message.type === "audio" ? (
                          <audio src={message.data} type="audio/mp3" controls />
                        ) : (
                          <p>{message.text}</p>
                        )}

                        <span>{message.time}</span>

                        {clickdroit === message.id && (
                          <div className="clickdroit" ref={refdroit}>
                            <p onClick={() => handleRepondre(message)}>
                              Répondre
                              <span>
                                <MdQuestionAnswer color="blue" />
                              </span>
                            </p>
                            {message.text && (
                              <p onClick={() => handlecopyText(message.text)}>
                                Copier
                                <span>
                                  <FaCopy color="green" />
                                </span>
                              </p>
                            )}
                            {((message.type &&
                              message.type.startsWith("image/")) ||
                              message.type.startsWith("video/") ||
                              message.type.startsWith("audio/") ||
                              message.type.startsWith(
                                "application/x-mobipocket-ebook"
                              ) ||
                              message.type === "application/epub+zip" ||
                              message.type === "application/pdf" ||
                              message.type.startsWith("application/")) && (
                              <p onClick={() => handleDownload(message)}>
                                Télécharger
                                <span>
                                  <FaCloudDownloadAlt color="yellow" />
                                </span>
                              </p>
                            )}
                            <p onClick={() => handleDelete(message.id)}>
                              Supprimer
                              <span>
                                <MdDelete color="red" />
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  }
                })}

              <div className="" ref={refposition}></div>
            </div>

            <div className="MessageHomeRightContent">
              {copytext && (
                <div className="reponseText">
                  <p>
                    {textanswer.startsWith("data:image/") ? (
                      <img
                        src={textanswer}
                        alt="Réponse image"
                        style={{ width: "70px", height: "30px" }}
                      />
                    ) : textanswer.startsWith("data:video/") ? (
                      <video
                        src={textanswer}
                        style={{ width: "70px", height: "30px" }}
                      />
                    ) : textanswer.startsWith("data:audio/") ? (
                      <audio
                        src={textanswer}
                        controls
                        style={{ maxWidth: "100px" }}
                      />
                    ) : textanswer.endsWith(".pdf") ? (
                      <>
                        <img
                          src={pdf}
                          alt=""
                          style={{ width: "30px", height: "30px" }}
                        />
                      </>
                    ) : (
                      <p>{textanswer}</p>
                    )}
                    <span onClick={handledeleteanswer}>
                      <GiCancel />{" "}
                    </span>
                  </p>
                </div>
              )}
              <div className="MessageHomeRightInput">
                <div className="MessageRightCommentOptionText">
                  <div className="OptionSmsInput">
                    <div
                      className="CallOption"
                      style={{ backgroundColor: "white" }}
                    >
                      <p>
                        <span
                          className="ButtonMenu"
                          onClick={handleshowEmoji}
                          ref={buttonref}
                        >
                          <MdEmojiEmotions color="tomato" />
                        </span>
                        <label>icônes</label>
                      </p>
                    </div>
                    <div className="CallOption">
                      <p>
                        <span className="ButtonMenu" onClick={handlemedia}>
                          <IoMdPhotos color="violet" />
                        </span>
                        <label>media</label>
                      </p>
                      <input
                        type="file"
                        name=""
                        id=""
                        onChange={handlemediachange}
                        ref={mediaref}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                  <div className="writeSmsInput">
                    {!showAudioCanvas ? (
                      <textarea
                        ref={reffocus}
                        name=""
                        id="messageInput"
                        placeholder="taper un message"
                        value={copytext ? messageReponse : message}
                        onChange={handlewritemessage}
                        spellCheck="true"
                      />
                    ) : (
                      <div className="LaunchAudio">
                        <div className="AudioHeader">
                          <div className="audioControls">
                            {!isRecording ? (
                              <div
                                className="CallOption"
                                onClick={startRecording}
                              >
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
                                  <div
                                    className="CallOption"
                                    onClick={resumeRecording}
                                  >
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
                                  <div
                                    className="CallOption"
                                    onClick={pauseRecording}
                                  >
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
                                <div
                                  className="CallOption"
                                  onClick={stopRecording}
                                >
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

                            <div
                              className="CallOption"
                              onClick={deleteRecording}
                            >
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
                          <div className="audioTimer">{formatTime(timer)}</div>
                        </div>
                        {audioBlob && (
                          <div className="audioPreview">
                            <audio src={audioBlob} controls />
                            <button
                              onClick={sendAudioMessage}
                              className="sendAudioButton"
                            >
                              <IoSend /> Envoyer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="SendSmsInput">
                    <div
                      className="CallOption"
                      style={{ backgroundColor: "white" }}
                    >
                      <>
                        {send ? (
                          <p>
                            <span
                              className="ButtonMenu"
                              style={{ cursor: "default" }}
                            >
                              <FaMicrophone color="blue" onClick={showaudio} />
                            </span>
                            <label>audio</label>
                          </p>
                        ) : (
                          <p>
                            <span className="ButtonMenu">
                              <IoSend color="blue" onClick={sendmessage} />
                            </span>
                            <label>envoyer</label>
                          </p>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showemojis && (
              <div className="EmojiTable" ref={emojiref}>
                <Emoji handleEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
        ) : (
          <div className="emptyMessage">
            <p>veuillez choisir un ami pour débuter la conversation </p>
            <img src={logo} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
