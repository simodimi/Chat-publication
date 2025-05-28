import React, { useState, useRef, useEffect } from "react";
import "./status.css";
import nomane from "../../assets/icone/personne.jpeg";
import { GiCrossMark } from "react-icons/gi";
import { MdAddAPhoto, MdSms, MdOutlineFormatSize } from "react-icons/md";
import { IoColorPalette, IoVideocam } from "react-icons/io5";
import { FaFileVideo, FaFilter, FaMicrophone } from "react-icons/fa";
import { PiSelectionBackground } from "react-icons/pi";
import { FaImage } from "react-icons/fa6";
import { BsEmojiLaughingFill, BsEmojiWinkFill } from "react-icons/bs";
import Audio from "./Audio";
import Sms from "./Sms";
import Emoji from "./Emoji";
import Photos from "./Photos";
import Video from "./Video";
import Selfie from "./Selfie";
import SelfieViedo from "./SelfieViedo";
import StyleBackground from "./StyleBackground";
import ChangeBg from "./ChangeBg";
import Taille from "./Taille";
import FontStyle from "./FontStyle";
import FilterImage from "./FilterImage";
import EmojiMobile from "./EmojiMobile";
import { TiThMenu } from "react-icons/ti";
import { RiFontSize } from "react-icons/ri";

const StatusCircle = ({ numStatuses = 0, radius = 30, strokeWidth = 3 }) => {
  const center = 30;
  const circumference = 2 * Math.PI * radius;
  const gap = 0.05; // Espace entre les arcs (en radians)

  const arcs = Array.from({ length: numStatuses }, (_, i) => {
    const startAngle = (2 * Math.PI * i) / numStatuses + gap;
    const endAngle = (2 * Math.PI * (i + 1)) / numStatuses - gap;

    const startX = center + radius * Math.cos(startAngle);
    const startY = center + radius * Math.sin(startAngle);
    const endX = center + radius * Math.cos(endAngle);
    const endY = center + radius * Math.sin(endAngle);

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    const d = `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
    `;

    return (
      <path
        key={i}
        d={d}
        stroke="#4CAF50"
        strokeWidth={strokeWidth}
        fill="none"
      />
    );
  });

  return (
    <svg
      width="60"
      height="60"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      {arcs}
      <circle
        cx={center}
        cy={center}
        r={radius - strokeWidth}
        fill="transparent"
      />
    </svg>
  );
};

const Status = () => {
  const [publication, setPublication] = useState(false);
  const [selection, setselection] = useState(false);
  const [createStatut, setCreateStatut] = useState(true);
  const [statuts, setStatuts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isViewingStatus, setIsViewingStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuaction, setMenuaction] = useState(true);
  const [selfieButton, setSelfieButton] = useState(true);
  const [videoButton, setVideoButton] = useState(true);
  const [bgButton, setBgButton] = useState(true);
  const [sizeButton, setSizeButton] = useState(true);
  const [colorButton, setColorButton] = useState(true);
  const [emojiButton, setEmojiButton] = useState(true);
  const [styleButton, setStyleButton] = useState(true);
  const [filtreButton, setFiltreButton] = useState(true);
  const [ButtonClick, setButtonClick] = useState(false);
  const [SeeButton, setSeeButton] = useState(false);
  const [SelectionButton, setSelectionButton] = useState(true);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [visualisationAudio, setVisualisationAudio] = useState(false);
  const [visualisationTexte, setVisualisationTexte] = useState(false);
  const [visualisationEmoji, setVisualisationEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [visualisationColorText, setVisualisationColorText] = useState(false);
  const [colorText, setcolorText] = useState("black");
  const [visualisationBgText, setVisualisationBgText] = useState(false);
  const [bgtext, setbgtext] = useState("");
  const [visualisationTailleText, setVisualisationTailleText] = useState(false);
  const [taille, setTaille] = useState("14px");
  const [visualisationFiltre, setVisualisationFiltre] = useState(false);
  const [filterPhoto, setFilterPhoto] = useState("none");
  const [visualisationFont, setVisualisationFont] = useState(false);
  const [font, setFont] = useState("roboto");
  const [visualisationSelfie, setVisualisationSelfie] = useState(false);
  const [isMobileEmojiMode, setIsMobileEmojiMode] = useState(false);
  const [mobileEmojis, setMobileEmojis] = useState([]);
  const [visualisationEmojiMobile, setVisualisationEmojiMobile] =
    useState(false);
  const [visualisationSelfieVideo, setVisualisationSelfieVideo] =
    useState(false);
  const refphotos = useRef(null);
  const [showPhoto, setShowPhoto] = useState(null);
  const [visualisationPhoto, setVisualisationPhoto] = useState(false);
  const refvideo = useRef(null);
  const [showVideo, setShowVideo] = useState(null);
  const [visualisationVideo, setVisualisationVideo] = useState(false);
  const [closePrincipal, setClosePrincipal] = useState(false);

  const progressRef = useRef(null);
  const audioRef = useRef(null);
  const statusTimerRef = useRef(null);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  const audioview = () => {
    setVisualisationAudio(true);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationFiltre(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationColorText(false);
    setVisualisationEmojiMobile(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
  };

  const textview = () => {
    setSelfieButton(false);
    setVideoButton(false);
    setFiltreButton(false);
    setVisualisationTexte(true);
    setVisualisationAudio(false);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationFiltre(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationColorText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
    setMenuaction(true);
  };

  const emojiview = () => {
    setSelfieButton(false);
    setVideoButton(false);
    setFiltreButton(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(!visualisationEmoji);
    setIsMobileEmojiMode(false);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationFiltre(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationColorText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
  };

  const colorTextview = () => {
    setVisualisationColorText((prev) => !prev);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationFiltre(false);
    setVisualisationTailleText(false);
    setVisualisationBgText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
  };

  const ChangeColorText = (e) => {
    setcolorText(e);
  };

  const Changebg = (e) => {
    setbgtext(e);
  };

  const bgtextview = () => {
    setVisualisationBgText((prev) => !prev);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationColorText(false);
    setVisualisationTailleText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
    setVisualisationFiltre(false);
  };

  const ChangeTailleText = (e) => {
    setTaille(e);
  };

  const tailleview = () => {
    setVisualisationTailleText((prev) => !prev);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
    setVisualisationFiltre(false);
  };

  const ChangeFilter = (e) => {
    setFilterPhoto(e);
  };

  const filtreview = () => {
    setVisualisationFiltre(true);
    setVisualisationAudio(false);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationPhoto(true);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
  };

  const familyview = () => {
    setVisualisationFont((prev) => !prev);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationSelfieVideo(false);
    setVisualisationEmojiMobile(false);
    setVisualisationFiltre(false);
  };

  const Selfieview = () => {
    setVisualisationSelfie(true);
    setVisualisationAudio(false);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfieVideo(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationEmojiMobile(false);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
  };

  const emojimobileview = () => {
    setVisualisationEmojiMobile((prev) => !prev);
    setIsMobileEmojiMode(true);
    setVisualisationAudio(false);
    setVisualisationTexte(true);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationSelfieVideo(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
  };

  const addMobileEmoji = (emoji) => {
    setMobileEmojis([...mobileEmojis, { id: Date.now(), emoji, x: 0, y: 0 }]);
  };

  const moveMobileEmoji = (id, newX, newY) => {
    setMobileEmojis(
      mobileEmojis.map((emoji) =>
        emoji.id === id ? { ...emoji, x: newX, y: newY } : emoji
      )
    );
  };

  const deleteMobileEmoji = (id) => {
    setMobileEmojis(mobileEmojis.filter((emoji) => emoji.id !== id));
  };

  const handleMobileEmojiClick = (emoji) => {
    setVisualisationEmojiMobile(true);
    addMobileEmoji(emoji);
  };

  const SelfieVideoview = () => {
    setVisualisationSelfieVideo(true);
    setVisualisationAudio(false);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
    setVisualisationEmojiMobile(false);
  };

  const photoview = () => {
    console.log("Activation de la vue photo");
    setVisualisationPhoto(true);
    setVisualisationAudio(false);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationEmojiMobile(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setStyleButton(false);
    setSizeButton(false);
    setFiltreButton(true);
    setBgButton(false);
    setColorButton(false);
    setSelfieButton(false);
    setVideoButton(false);
  };

  const SelectPhoto = () => {
    console.log("Sélection de photo déclenchée");
    if (refphotos.current) {
      refphotos.current.click();
    } else {
      console.error("Référence à l'input file non trouvée");
    }
  };

  const ChangePicture = (e) => {
    console.log("ChangePicture appelé");
    const file = e.target.files[0];
    if (file) {
      console.log("Fichier sélectionné:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (file.size <= 8 * 1024 * 1024) {
        const read = new FileReader();
        read.onloadend = () => {
          console.log(
            "Image chargée avec succès, longueur:",
            read.result.length
          );
          setShowPhoto(read.result);
          setPublication(true);
        };
        read.onerror = (error) => {
          console.error("Erreur lors de la lecture du fichier:", error);
          alert("Erreur lors de la lecture de l'image");
        };
        read.readAsDataURL(file);
      } else {
        console.error("Image trop grande:", file.size);
        alert("La taille de l'image est trop grande (max 8MB)");
        setShowPhoto(null);
      }
    } else {
      console.log("Aucun fichier sélectionné dans ChangePicture");
      setShowPhoto(null);
    }
  };

  const videoview = () => {
    console.log("Activation de la vue vidéo");
    setVisualisationVideo(true);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
    setStyleButton(false);
    setSizeButton(false);
    setFiltreButton(false);
    setBgButton(false);
    setColorButton(false);
    setSelfieButton(false);
    setVideoButton(false);
    setEmojiButton(false);
    setMenuaction(false);
  };

  const SelectVideo = () => {
    console.log("Sélection de vidéo déclenchée");
    if (refvideo.current) {
      refvideo.current.click();
    } else {
      console.error("Référence à l'input file non trouvée");
    }
  };

  const ChangeVideo = (e) => {
    console.log("ChangeVideo appelé");
    const file = e.target.files[0];
    if (file) {
      console.log("Fichier vidéo sélectionné:", {
        name: file.name,
        type: file.type,
        size: file.size,
      });

      if (file.size <= 35 * 1024 * 1024) {
        const read = new FileReader();
        read.onloadend = () => {
          console.log("Vidéo chargée avec succès");
          setShowVideo(read.result);
          setPublication(true);
        };
        read.onerror = (error) => {
          console.error("Erreur lors de la lecture du fichier:", error);
          alert("Erreur lors de la lecture de la vidéo");
        };
        read.readAsDataURL(file);
      } else {
        console.error("Vidéo trop grande:", file.size);
        alert("La taille de la vidéo est trop grande (max 35MB)");
        setShowVideo(null);
      }
    } else {
      console.log("Aucun fichier sélectionné dans ChangeVideo");
      setShowVideo(null);
    }
  };

  const onclosed = () => {
    setCreateStatut(!createStatut);
    setClosePrincipal(!closePrincipal);
  };

  const addStatus = (status) => {
    setStatuts([...statuts, status]);
  };

  const deleteStatus = async (statusId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/status/${statusId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du statut");
      }

      setStatuts((prevStatuts) =>
        prevStatuts.filter((status) => status.id_status !== statusId)
      );

      if (
        selectedUser &&
        selectedUser.statuses[currentStatusIndex]?.id_status === statusId
      ) {
        closeStatusViewer();
      }

      console.log("Statut supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const fetchUserStatuses = async () => {
    try {
      console.log("Début de fetchUserStatuses");
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData) {
        console.error("Aucun utilisateur connecté");
        return;
      }

      const response = await fetch("http://localhost:5000/api/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statuts");
      }

      const data = await response.json();
      console.log("Statuts reçus du serveur:", data.length);

      const userStatuses = data.filter(
        (status) => status.id_utilisateur === userData.id_utilisateur
      );
      console.log("Statuts filtrés pour l'utilisateur:", userStatuses.length);

      // Vérifier les statuts vidéo
      const videoStatuses = userStatuses.filter(
        (status) => status.type === "video"
      );
      console.log("Statuts vidéo trouvés:", videoStatuses.length);

      setStatuts(userStatuses);
    } catch (error) {
      console.error("Erreur lors de la récupération des statuts:", error);
    }
  };

  const checkExpiredStatuses = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/status", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statuts");
      }

      const data = await response.json();
      const now = new Date();

      const activeStatuses = data.filter((status) => {
        const statusDate = new Date(status.date_creation);
        const hoursDiff = (now - statusDate) / (1000 * 60 * 60);
        return hoursDiff < 24;
      });

      setStatuts(activeStatuses);
    } catch (error) {
      console.error("Erreur lors de la vérification des statuts:", error);
    }
  };

  useEffect(() => {
    fetchUserStatuses();
    const interval = setInterval(() => {
      checkExpiredStatuses();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const openStatusViewer = (status) => {
    if (!status) return;

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData) return;

    console.log("Ouverture du viewer pour le statut:", {
      id: status.id_status,
      type: status.type,
      contentLength: status.content?.length,
    });

    const sortedStatuses = [...statuts].sort(
      (a, b) => new Date(b.date_creation) - new Date(a.date_creation)
    );

    const currentIndex = sortedStatuses.findIndex(
      (s) => s.id_status === status.id_status
    );

    console.log("Index du statut dans la liste triée:", currentIndex);

    const viewerData = {
      id: userData.id_utilisateur,
      name: userData.name_utilisateur,
      photo: userData.photo_profil || nomane,
      statuses: sortedStatuses,
    };

    setSelectedUser(viewerData);
    setCurrentStatusIndex(currentIndex);
    setIsViewingStatus(true);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeStatusViewer = () => {
    setIsViewingStatus(false);
    setSelectedUser(null);
    setCurrentStatusIndex(0);
    setProgress(0);
    setIsPlaying(false);
    if (statusTimerRef.current) {
      clearInterval(statusTimerRef.current);
    }
  };

  useEffect(() => {
    if (
      isViewingStatus &&
      isPlaying &&
      selectedUser?.statuses[currentStatusIndex]?.type !== "video"
    ) {
      statusTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(statusTimerRef.current);
            nextStatus();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
      }
    };
  }, [
    isViewingStatus,
    isPlaying,
    currentStatusIndex,
    selectedUser?.statuses[currentStatusIndex]?.type,
  ]);

  const nextStatus = () => {
    if (selectedUser && currentStatusIndex < selectedUser.statuses.length - 1) {
      setCurrentStatusIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeStatusViewer();
    }
  };

  const previousStatus = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleAudioLoad = (e) => {
    setAudioDuration(e.target.duration);
  };

  const handleAudioTimeUpdate = (e) => {
    setAudioProgress((e.target.currentTime / e.target.duration) * 100);
  };

  const toggleAudioPlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const applyFilter = (filter) => {
    setCurrentFilter(filter);
  };

  const markStatusAsViewed = (userId, statusId) => {
    setStatuts((prevStatuts) =>
      prevStatuts.map((status) =>
        status.id === statusId ? { ...status, viewed: true } : status
      )
    );
  };

  const calculateStatusSegments = (statuses) => {
    const totalDuration = statuses.reduce(
      (acc, status) => acc + status.duration,
      0
    );
    return statuses.map((status) => ({
      ...status,
      segmentPercentage: (status.duration / totalDuration) * 100,
    }));
  };

  const renderStatusCircle = (user) => {
    const unviewedCount = user.statuses.filter(
      (status) => !status.viewed
    ).length;
    const viewedCount = user.statuses.filter((status) => status.viewed).length;

    if (unviewedCount === 0 && viewedCount === 0) return null;

    return (
      <div className="status-circle">
        {unviewedCount > 0 && <div className="status-circle-unviewed" />}
        {viewedCount > 0 && <div className="status-circle-viewed" />}
        {unviewedCount > 0 && viewedCount > 0 && (
          <div className="status-circle-half" />
        )}
      </div>
    );
  };

  const handleAudioSave = (audioData) => {
    setStatuts((prevStatuses) => [
      ...prevStatuses,
      {
        type: "audio",
        content: audioData.content,
        duration: audioData.duration,
        timestamp: audioData.timestamp,
        viewed: false,
      },
    ]);
  };

  const resetAllOptions = () => {
    setVisualisationTexte(false);
    setVisualisationAudio(false);
    setVisualisationPhoto(false);
    setVisualisationVideo(false);
    setVisualisationSelfie(false);
    setVisualisationEmoji(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFont(false);
    setVisualisationFiltre(false);
    setVisualisationEmojiMobile(false);
    setVisualisationSelfieVideo(false);
    setSelectedEmoji(null);
    setcolorText("black");
    setbgtext("");
    setTaille("14px");
    setFont("roboto");
    setFilterPhoto("none");
    setMobileEmojis([]);
    setShowPhoto(null);
    setShowVideo(null);
    setPublication(false);
    setMenuaction(true);
    setSelfieButton(true);
    setVideoButton(true);
    setFiltreButton(true);
    setColorButton(true);
    setEmojiButton(true);
    setBgButton(true);
    setSizeButton(true);
    setStyleButton(true);
  };

  const handlePublish = async () => {
    try {
      console.log("Début de handlePublish");
      let statutData = {
        type: "",
        content: "",
        texte: "",
        styles: {},
      };

      console.log("État actuel:", {
        visualisationPhoto,
        showPhoto: showPhoto ? "Photo présente" : "Pas de photo",
        visualisationVideo,
        showVideo: showVideo ? "Vidéo présente" : "Pas de vidéo",
        visualisationAudio,
        visualisationTexte,
        colorText,
        bgtext,
        taille,
        font,
        mobileEmojis,
      });

      if (visualisationPhoto && showPhoto) {
        console.log("Création d'un statut image");
        statutData = {
          type: "image",
          content: showPhoto,
          texte: "",
          styles: {
            filter: filterPhoto || "none",
          },
        };
      } else if (visualisationPhoto && !showPhoto) {
        throw new Error("Aucune photo sélectionnée");
      } else if (visualisationVideo && showVideo) {
        console.log("Création d'un statut vidéo avec contenu:", {
          type: "video",
          contentLength: showVideo.length,
          contentType: typeof showVideo,
        });
        statutData = {
          type: "video",
          content: showVideo,
          texte: "",
          styles: {},
        };
      } else if (visualisationVideo && !showVideo) {
        throw new Error("Aucune vidéo sélectionnée");
      } else if (visualisationAudio) {
        console.log("Création d'un statut audio");
        const audioData = localStorage.getItem("lastAudioRecording");
        if (audioData) {
          statutData = {
            type: "audio",
            content: audioData,
            texte: "",
            styles: {},
          };
        }
      } else if (visualisationTexte) {
        console.log("Création d'un statut texte");
        const texteContent =
          document.querySelector(".WriteSmsCall textarea")?.value || "";
        console.log("Contenu du texte:", texteContent);
        statutData = {
          type: "texte",
          content: "",
          texte: texteContent,
          styles: {
            color: colorText,
            backgroundColor: bgtext,
            fontSize: taille,
            fontFamily: font,
            emojis: mobileEmojis,
          },
        };
      }

      console.log("Données du statut à envoyer:", {
        type: statutData.type,
        contentLength: statutData.content?.length || 0,
        texte: statutData.texte,
      });

      const response = await fetch("http://localhost:5000/api/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(statutData),
      });

      console.log("Réponse du serveur:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur détaillée:", errorData);
        throw new Error("Erreur lors de la publication du statut");
      }

      const responseData = await response.json();
      console.log("Statut publié avec succès:", responseData);

      // Vérifier que le statut a été ajouté à la liste
      await fetchUserStatuses();
      console.log("Statuts mis à jour après publication");

      resetAllOptions();
      setCreateStatut(true);
      setClosePrincipal(false);
    } catch (error) {
      console.error("Erreur complète lors de la publication:", error);
      alert(error.message || "Erreur lors de la publication du statut");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    setVisualisationEmoji(false);
  };

  const ChangeFontText = (font) => {
    setFont(font);
  };

  const handleChoice = () => {
    setButtonClick(!ButtonClick);
    setSelectionButton(!SelectionButton);
    setSeeButton(!SeeButton);
  };

  return (
    <div className="StatusHome">
      <div className="StatusHomeLeft">
        <div className="StatutOwn">
          <p id="Appel">Statut</p>
          <div className="StatusContact">
            <div
              className="StatusContactImg"
              onClick={() => {
                if (statuts && statuts.length > 0) {
                  const sortedStatuses = [...statuts].sort(
                    (a, b) =>
                      new Date(b.date_creation) - new Date(a.date_creation)
                  );
                  openStatusViewer(sortedStatuses[0]);
                }
              }}
              style={{
                cursor: "pointer",
                position: "relative",
                width: "60px",
                height: "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StatusCircle numStatuses={statuts.length} />
              <img
                src={
                  JSON.parse(localStorage.getItem("userData"))?.photo_profil ||
                  nomane
                }
                alt="Photo de profil"
                style={{
                  width: "90%",
                  height: "90%",
                  borderRadius: "50%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>
            <div className="StatusName">
              <p>Mes statuts</p>
              {statuts && statuts.length > 0 && (
                <p>{formatTime(new Date(statuts[0].date_creation))}</p>
              )}
            </div>
          </div>
          <span
            className="ButtonMenu"
            onClick={(e) => {
              e.stopPropagation();
              setCreateStatut(!createStatut);
              setClosePrincipal(true);
            }}
          >
            créer un statut
          </span>
        </div>
        <div className="StatusOther">
          <p style={{ marginLeft: "10px" }}>Mises à jour récentes</p>
          <div className="StatusContact">
            <div className="StatusContactImg">
              <img src={nomane} alt="Photo par défaut" />
            </div>
            <div className="StatusName">
              <p>Statut des autres</p>
              <p>Aucun statut récent</p>
            </div>
          </div>
        </div>
        <div className="StatusSee">
          <p style={{ marginLeft: "10px" }}>Mises à jour vues</p>
          <span>statut déjà vus</span>
          <div className="StatusContact">
            <div className="StatusContactImg">
              <img src={nomane} alt="Photo par défaut" />
            </div>
            <div className="StatusName">
              <p>Statuts vus</p>
              <p>Aucun statut vu</p>
            </div>
          </div>
        </div>
      </div>
      <div className="StatusHomeRight">
        {createStatut ? (
          <p>Cliquez sur un contact pour voir ses mises à jour de statut</p>
        ) : (
          closePrincipal && (
            <>
              <div className="CreateStatus">
                {publication && (
                  <button id="publish" onClick={handlePublish}>
                    Publier
                  </button>
                )}
                <div className="CallHomeButton">
                  <p>
                    <span className="ButtonMenu">
                      <GiCrossMark onClick={onclosed} />
                    </span>
                  </p>
                </div>
                <div className="CallHomeText">
                  <div className="CallHomeTextStyle">
                    <div className="CallOption">
                      {menuaction && (
                        <span
                          className={`ButtonMenu ${
                            ButtonClick ? "activeMenu" : ""
                          }`}
                          onClick={() => handleChoice()}
                        >
                          {SelectionButton ? (
                            <TiThMenu />
                          ) : (
                            <GiCrossMark color="blue" />
                          )}
                        </span>
                      )}
                      {SeeButton && (
                        <>
                          {selfieButton && (
                            <p>
                              <span className="ButtonMenu">
                                <MdAddAPhoto
                                  onClick={Selfieview}
                                  color="blue"
                                />
                              </span>
                              <label>prendre un selfie</label>
                            </p>
                          )}
                          {videoButton && (
                            <p>
                              <span className="ButtonMenu">
                                <FaFileVideo
                                  onClick={SelfieVideoview}
                                  color="red"
                                />
                              </span>
                              <label>prendre une video</label>
                            </p>
                          )}
                          {filtreButton && (
                            <p>
                              <span className="ButtonMenu">
                                <FaFilter onClick={filtreview} color="yellow" />
                              </span>
                              <label>appliquer un filtre</label>
                            </p>
                          )}
                          {colorButton && (
                            <p>
                              <span className="ButtonMenu">
                                <IoColorPalette
                                  onClick={colorTextview}
                                  color="green"
                                />
                              </span>
                              <label>selectionner une couleur de texte</label>
                            </p>
                          )}
                          {emojiButton && (
                            <p>
                              <span className="ButtonMenu">
                                <BsEmojiLaughingFill
                                  onClick={emojimobileview}
                                  color="purple"
                                />
                              </span>
                              <label>ajouter des emoji </label>
                            </p>
                          )}

                          {bgButton && (
                            <p>
                              <span className="ButtonMenu">
                                <PiSelectionBackground
                                  onClick={bgtextview}
                                  color="tomato"
                                />
                              </span>
                              <label>ajouter fond d'ecran </label>
                            </p>
                          )}
                          {sizeButton && (
                            <p>
                              <span className="ButtonMenu">
                                <RiFontSize onClick={familyview} color="gray" />
                              </span>
                              <label>font texte </label>
                            </p>
                          )}
                          {styleButton && (
                            <p>
                              <span className="ButtonMenu">
                                <MdOutlineFormatSize onClick={tailleview} />
                              </span>
                              <label>taille texte </label>
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {visualisationAudio && <Audio onSave={handleAudioSave} />}
                  {visualisationTexte && (
                    <div className="">
                      <Sms
                        selectedEmoji={selectedEmoji}
                        colorText={colorText}
                        bgtext={bgtext}
                        taille={taille}
                        font={font}
                        mobileEmojis={mobileEmojis}
                        onMoveEmoji={moveMobileEmoji}
                        onDeleteEmoji={deleteMobileEmoji}
                        publication={publication}
                        isMobileEmojiMode={isMobileEmojiMode}
                        setPublication={setPublication}
                        setSelectedEmoji={setSelectedEmoji}
                      />
                    </div>
                  )}
                  {visualisationEmoji && (
                    <Emoji
                      onEmojiSelect={handleEmojiSelect}
                      selectedEmoji={selectedEmoji}
                    />
                  )}
                  {visualisationPhoto && (
                    <div>
                      <Photos
                        showPhoto={showPhoto}
                        filterPhoto={filterPhoto}
                        setPublication={setPublication}
                        onPhotoSelect={SelectPhoto}
                      />
                      {mobileEmojis.map((emoji) => (
                        <div
                          key={emoji.id}
                          style={{
                            position: "absolute",
                            left: emoji.x,
                            top: emoji.y,
                            fontSize: "24px",
                            cursor: "move",
                          }}
                          draggable
                          onDragEnd={(e) => {
                            const newX = e.clientX - e.target.offsetWidth / 2;
                            const newY = e.clientY - e.target.offsetHeight / 2;
                            moveMobileEmoji(emoji.id, newX, newY);
                          }}
                        >
                          {emoji.emoji}
                          <button
                            onClick={() => deleteMobileEmoji(emoji.id)}
                            style={{
                              marginLeft: "5px",
                              cursor: "pointer",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                            }}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {visualisationVideo && (
                    <Video
                      showVideo={showVideo}
                      setPublication={setPublication}
                      onVideoSelect={SelectVideo}
                    />
                  )}
                  {visualisationSelfie && (
                    <Selfie
                      setMenuaction={setMenuaction}
                      menuaction={menuaction}
                      setSeeButton={setSeeButton}
                      SeeButton={SeeButton}
                    />
                  )}
                  {visualisationSelfieVideo && <SelfieViedo />}
                  {visualisationColorText && (
                    <StyleBackground ChangeColorText={ChangeColorText} />
                  )}
                  {visualisationBgText && <ChangeBg Changebg={Changebg} />}
                  {visualisationTailleText && (
                    <Taille ChangeTailleText={ChangeTailleText} />
                  )}
                  {visualisationFont && (
                    <FontStyle ChangeFontText={ChangeFontText} />
                  )}
                  {visualisationFiltre && (
                    <FilterImage
                      setFilter={ChangeFilter}
                      setMenuaction={setMenuaction}
                      setSeeButton={setSeeButton}
                    />
                  )}
                  {visualisationEmojiMobile && (
                    <EmojiMobile onEmojSelect={handleMobileEmojiClick} />
                  )}
                </div>
                <div className="principaloption">
                  <div className="CallOption">
                    <p>
                      <span className="ButtonMenu">
                        <MdSms onClick={textview} />
                      </span>
                      <label>ecrire un message</label>
                    </p>
                    <p>
                      <span className="ButtonMenu">
                        <BsEmojiWinkFill
                          onClick={emojiview}
                          style={{ color: "yellow" }}
                        />
                      </span>
                      <label>ajouter des emoji</label>
                    </p>
                    <p>
                      <span className="ButtonMenu">
                        <IoVideocam
                          style={{ color: "blue" }}
                          onClick={() => {
                            videoview();
                            SelectVideo();
                          }}
                        />
                        <input
                          type="file"
                          accept="video/*"
                          style={{ display: "none" }}
                          onChange={ChangeVideo}
                          ref={refvideo}
                        />
                      </span>
                      <label>selectionner une vidéo</label>
                    </p>
                    <p>
                      <span className="ButtonMenu">
                        <FaImage
                          style={{ color: "red" }}
                          onClick={() => {
                            photoview();
                            SelectPhoto();
                          }}
                        />
                        <input
                          type="file"
                          name=""
                          id=""
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={ChangePicture}
                          ref={refphotos}
                        />
                      </span>
                      <label>selectionner une image</label>
                    </p>
                    <p>
                      <span className="ButtonMenu">
                        <FaMicrophone
                          style={{ color: "green" }}
                          onClick={audioview}
                        />
                      </span>
                      <label>lancer un enregistrement</label>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>
      {isViewingStatus &&
        selectedUser &&
        selectedUser.statuses &&
        selectedUser.statuses.length > 0 && (
          <div
            className="status-viewer-overlay"
            onClick={closeStatusViewer}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              className="status-viewer"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "90%",
                maxWidth: "500px",
                backgroundColor: "#000",
                borderRadius: "10px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  padding: "10px",
                  gap: "2px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2,
                }}
              >
                {selectedUser.statuses.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: "3px",
                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width:
                          index === currentStatusIndex
                            ? `${progress}%`
                            : index < currentStatusIndex
                            ? "100%"
                            : "0%",
                        height: "100%",
                        backgroundColor: "white",
                        transition: "width 0.1s linear",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div
                className="status-viewer-header"
                style={{ marginTop: "20px" }}
              >
                <img
                  src={selectedUser.photo}
                  alt={selectedUser.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span style={{ color: "white" }}>{selectedUser.name}</span>
                <span className="status-time">
                  {formatTime(
                    new Date(
                      selectedUser.statuses[currentStatusIndex].date_creation
                    )
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        "Voulez-vous vraiment supprimer ce statut ?"
                      )
                    ) {
                      deleteStatus(
                        selectedUser.statuses[currentStatusIndex].id_status
                      );
                    }
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "rgba(255, 0, 0, 0.5)",
                    border: "none",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
              <div
                className="status-viewer-content"
                style={{
                  width: "100%",
                  height: "calc(100vh - 100px)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  position: "relative",
                }}
              >
                {currentStatusIndex > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      previousStatus();
                    }}
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      border: "none",
                      color: "white",
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "50%",
                    }}
                  >
                    ←
                  </button>
                )}
                {currentStatusIndex < selectedUser.statuses.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextStatus();
                    }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(0, 0, 0, 0.5)",
                      border: "none",
                      color: "white",
                      padding: "10px",
                      cursor: "pointer",
                      borderRadius: "50%",
                    }}
                  >
                    →
                  </button>
                )}
                {selectedUser.statuses[currentStatusIndex].type === "image" && (
                  <img
                    src={selectedUser.statuses[currentStatusIndex].content}
                    alt="Status"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      filter:
                        selectedUser.statuses[currentStatusIndex].styles
                          ?.filter || "none",
                    }}
                  />
                )}
                {selectedUser.statuses[currentStatusIndex].type === "video" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <video
                      key={selectedUser.statuses[currentStatusIndex].id_status}
                      src={selectedUser.statuses[currentStatusIndex].content}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      onTimeUpdate={(e) => {
                        const video = e.target;
                        const progress =
                          (video.currentTime / video.duration) * 100;
                        setProgress(progress);
                      }}
                      onEnded={() => {
                        nextStatus();
                      }}
                      onError={(e) => {
                        console.error("Erreur de chargement de la vidéo:", {
                          error: e,
                          videoSrc:
                            selectedUser.statuses[
                              currentStatusIndex
                            ].content?.substring(0, 50) + "...",
                          statusId:
                            selectedUser.statuses[currentStatusIndex].id_status,
                        });
                      }}
                      onLoadedData={(e) => {
                        console.log("Vidéo chargée avec succès:", {
                          statusId:
                            selectedUser.statuses[currentStatusIndex].id_status,
                          type: selectedUser.statuses[currentStatusIndex].type,
                          contentLength:
                            selectedUser.statuses[currentStatusIndex].content
                              ?.length,
                          duration: e.target.duration,
                        });
                      }}
                    />
                  </div>
                )}
                {selectedUser.statuses[currentStatusIndex].type === "audio" && (
                  <audio
                    src={selectedUser.statuses[currentStatusIndex].content}
                    controls
                    autoPlay
                    style={{
                      width: "100%",
                      padding: "20px",
                    }}
                  />
                )}
                {selectedUser.statuses[currentStatusIndex].type === "texte" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                      backgroundColor:
                        selectedUser.statuses[currentStatusIndex].styles
                          ?.backgroundColor || "transparent",
                    }}
                  >
                    <p
                      style={{
                        color:
                          selectedUser.statuses[currentStatusIndex].styles
                            ?.color || "white",
                        fontSize:
                          selectedUser.statuses[currentStatusIndex].styles
                            ?.fontSize || "18px",
                        fontFamily:
                          selectedUser.statuses[currentStatusIndex].styles
                            ?.fontFamily || "roboto",
                        textAlign: "center",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {selectedUser.statuses[currentStatusIndex].texte}
                      {selectedUser.statuses[
                        currentStatusIndex
                      ].styles?.emojis?.map((emoji, index) => (
                        <span key={index} style={{ marginLeft: "5px" }}>
                          {emoji}
                        </span>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Status;
