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

// Données de test pour les utilisateurs et leurs statuts
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    photo: nomane,
    statuses: [
      {
        id: 1,
        type: "image",
        content: "https://example.com/status1.jpg",
        timestamp: new Date(Date.now() - 3600000), // 1 heure
        viewed: false,
      },
      {
        id: 2,
        type: "video",
        content: "https://example.com/status2.mp4",
        timestamp: new Date(Date.now() - 7200000), // 2 heures
        viewed: true,
      },
    ],
  },
  // Ajoutez d'autres utilisateurs ici
];

const Status = () => {
  const [publication, setPublication] = useState(false);
  const [selection, setselection] = useState(false); //selection pour background away
  const [createStatut, setCreateStatut] = useState(true); //bouton pour apercu de la div de creation des status
  //menu option
  const [SelectionButton, setSelectionButton] = useState(true); ///////menu
  const [ButtonClick, setButtonClick] = useState(false);
  const [SeeButton, setSeeButton] = useState(false);
  const [menuaction, setMenuaction] = useState(true);
  //option menu
  const [selfieButton, setSelfieButton] = useState(true);
  const [videoButton, setVideoButton] = useState(true);
  const [bgButton, setBgButton] = useState(true);
  const [sizeButton, setSizeButton] = useState(true);
  const [colorButton, setColorButton] = useState(true);
  const [emojiButton, setEmojiButton] = useState(true);
  const [styleButton, setStyleButton] = useState(true);
  const [filtreButton, setFiltreButton] = useState(true);
  const handleChoice = () => {
    setButtonClick(!ButtonClick);
    setSelectionButton(!SelectionButton);
    setSeeButton(!SeeButton);
  };
  //visualisation audio
  const [visualisationAudio, setVisualisationAudio] = useState(false);
  //liste des status
  const [statuts, setStatuts] = useState([]);
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
  //visualisation texte
  const [visualisationTexte, setVisualisationTexte] = useState(false);
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
  //visualisation emoji
  const [visualisationEmoji, setVisualisationEmoji] = useState(false);
  const emojiview = () => {
    setSelfieButton(false);
    setVideoButton(false);
    setFiltreButton(false);
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
  //handle emoji click pour sms
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };
  //visualisation couleur de texte
  const [visualisationColorText, setVisualisationColorText] = useState(false);
  const [colorText, setcolorText] = useState("black");
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
  //visualisation changer background
  const [visualisationBgText, setVisualisationBgText] = useState(false);
  const [bgtext, setbgtext] = useState("");
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
  //visualisation taille texte
  const [visualisationTailleText, setVisualisationTailleText] = useState(false);
  const [taille, setTaille] = useState("14px");
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
  //visualisation filtre
  const [visualisationFiltre, setVisualisationFiltre] = useState(false);
  const [filterPhoto, setFilterPhoto] = useState("none");
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
  //visualisation font
  const [visualisationFont, setVisualisationFont] = useState(false);
  const [font, setFont] = useState("roboto");
  const ChangeFontText = (e) => {
    setFont(e);
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
  //visualisation selfie
  const [visualisationSelfie, setVisualisationSelfie] = useState(false);
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
  //visualisation emoji mobile
  const [isMobileEmojiMode, setIsMobileEmojiMode] = useState(false);
  const [mobileEmojis, setMobileEmojis] = useState([]);
  const [visualisationEmojiMobile, setVisualisationEmojiMobile] =
    useState(false);
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
    setMobileEmojis([
      ...mobileEmojis,
      // Un ID généré à partir de la date actuelle (Date.now())
      { id: Date.now(), emoji, x: 0, y: 0 },
    ]);
  };
  const moveMobileEmoji = (id, newX, newY) => {
    //deplacement des emojis
    setMobileEmojis(
      mobileEmojis.map((emoji) =>
        //verification de id de l'emoji
        emoji.id === id
          ? //si l'id de l'emoji est égale à l'id de l'emoji déplacé alors on met à jour la position de l'emoji
            { ...emoji, x: newX, y: newY }
          : //sinon on retourne l'emoji
            emoji
      )
    );
  };
  const deleteMobileEmoji = (id) => {
    //suppression des emojis
    setMobileEmojis(mobileEmojis.filter((emoji) => emoji.id !== id));
  };
  const handleMobileEmojiClick = (emoji) => {
    setVisualisationEmojiMobile(true);
    addMobileEmoji(emoji);
  };
  //visualisation selfie video
  const [visualisationSelfieVideo, setVisualisationSelfieVideo] =
    useState(false);
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
  //visualisation photo
  const refphotos = useRef(null);
  const [showPhoto, setShowPhoto] = useState(null);
  const [visualisationPhoto, setVisualisationPhoto] = useState(false);
  const photoview = () => {
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
  };
  const SelectPhoto = () => {
    refphotos.current.click();
  };
  const ChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 8 * 1024 * 1024) {
        const read = new FileReader();
        read.onloadend = () => {
          setShowPhoto(read.result);
        };
        read.readAsDataURL(file);
      } else {
        alert("la taille de l'image est trop grande");
      }
    }
  };
  //visualisation video
  const refvideo = useRef(null);
  const [showVideo, setShowVideo] = useState(null);
  const [visualisationVideo, setVisualisationVideo] = useState(false);
  const videoview = () => {
    setVisualisationPhoto(false);
    setVisualisationAudio(false);
    setVisualisationTexte(false);
    setVisualisationEmoji(false);
    setVisualisationVideo(true);
    setVisualisationSelfie(false);
    setVisualisationEmojiMobile(false);
    setVisualisationColorText(false);
    setVisualisationBgText(false);
    setVisualisationTailleText(false);
    setVisualisationFiltre(false);
    setVisualisationFont(false);
    setVisualisationSelfieVideo(false);
  };

  const SelectVideo = () => {
    refvideo.current.click();
  };
  const ChangeVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 35 * 1024 * 1024) {
        const read = new FileReader();
        read.onloadend = () => {
          setShowVideo(read.result);
        };
        read.readAsDataURL(file);
        /*  const read = URL.createObjectURL(file); //pour lire le fichier video en creant une url temporaire
        setShowVideo(read);*/
      } else {
        alert("la taille de l'image est trop grande");
        setShowVideo(null);
      }
    }
  };
  //close page
  const [closePrincipal, setClosePrincipal] = useState(false);
  const onclosed = () => {
    setCreateStatut(!createStatut);
    setClosePrincipal(!closePrincipal);
  };

  // Fonction pour ajouter un statut
  const addStatus = (status) => {
    setStatuts([...statuts, status]);
  };

  // Fonction pour supprimer un statut
  const deleteStatus = (index) => {
    const updatedStatuts = statuts.filter((_, i) => i !== index);
    setStatuts(updatedStatuts);
  };

  // Nouveaux états pour les statuts
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [isViewingStatus, setIsViewingStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("none");
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Références
  const progressRef = useRef(null);
  const audioRef = useRef(null);
  const statusTimerRef = useRef(null);

  // Fonction pour formater le temps
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

  // Gestion de la visualisation des statuts
  const startStatusView = (user, index = 0) => {
    setSelectedUser(user);
    setCurrentStatusIndex(index);
    setIsViewingStatus(true);
    setProgress(0);
    setIsPlaying(true);
  };

  const closeStatusView = () => {
    setIsViewingStatus(false);
    setSelectedUser(null);
    setCurrentStatusIndex(0);
    setProgress(0);
    setIsPlaying(false);
    if (statusTimerRef.current) {
      clearInterval(statusTimerRef.current);
    }
  };

  // Gestion de la progression des statuts
  useEffect(() => {
    if (isViewingStatus && isPlaying) {
      statusTimerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(statusTimerRef.current);
            nextStatus();
            return 0;
          }
          return prev + 1;
        });
      }, 50); // 5 secondes pour un statut
    }
    return () => {
      if (statusTimerRef.current) {
        clearInterval(statusTimerRef.current);
      }
    };
  }, [isViewingStatus, isPlaying]);

  // Navigation entre les statuts
  const nextStatus = () => {
    if (selectedUser && currentStatusIndex < selectedUser.statuses.length - 1) {
      setCurrentStatusIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      closeStatusView();
    }
  };

  const previousStatus = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Gestion des messages vocaux
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

  // Gestion des filtres
  const applyFilter = (filter) => {
    setCurrentFilter(filter);
  };

  // Marquage des statuts comme vus
  const markStatusAsViewed = (userId, statusId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            statuses: user.statuses.map((status) =>
              status.id === statusId ? { ...status, viewed: true } : status
            ),
          };
        }
        return user;
      })
    );
  };

  // Rendu des cercles de statut
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
    // Ajouter le nouveau statut audio à la liste des statuts
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

  return (
    <div className="StatusHome">
      <div className="StatusHomeLeft">
        <div className="StatutOwn">
          <p id="Appel">Statut</p>

          <div className="StatusContact">
            <div className="StatusContactImg">
              <img src={nomane} alt="" />
              <h2></h2>
            </div>
            <div className="StatusName">
              <p>Mes statuts</p>
            </div>
          </div>
          <span
            className="ButtonMenu"
            onClick={() => {
              setCreateStatut(!createStatut);
              setClosePrincipal(true);
            }}
          >
            créer un statut
          </span>
        </div>
        <div className="StatusOther">
          <p style={{ marginLeft: "10px" }}>Mises à jour récentes</p>
          <div
            className={`StatusContact ${selection ? "StatusSelect" : ""}`}
            onClick={() => setselection(!selection)}
          >
            <div className="StatusContactImg">
              <img src={nomane} alt="" />
            </div>
            <div className="StatusName">
              <p>Statut des autres</p>
              <p>
                Aujourd'hui,<span> 12:00</span>
              </p>
            </div>
          </div>
        </div>
        <div className="StatusSee">
          <p style={{ marginLeft: "10px" }}>Mises à jour vues</p>
          <span>statut déjà vus</span>
          <div className="StatusContact">
            <div className="StatusContactImg">
              <img src={nomane} alt="" />
            </div>
            <div className="StatusName">
              <p>Mon statut</p>
              <p>
                hier,<span> 12:00</span>
              </p>
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
                {publication && <button id="publish">Publier</button>}
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
                          }  `}
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
                        taille={taille} //premier props et deuxieme usestate
                        font={font}
                        mobileEmojis={mobileEmojis} // Passez les emojis mobiles au composant Sms
                        onMoveEmoji={moveMobileEmoji} // Passez la fonction de déplacement
                        onDeleteEmoji={deleteMobileEmoji} // Passez la fonction de suppression
                        publication={publication}
                        isMobileEmojiMode={isMobileEmojiMode}
                        setPublication={setPublication}
                      />
                    </div>
                  )}
                  {visualisationEmoji && (
                    <Emoji onEmojiSelect={handleEmojiSelect} />
                  )}
                  {visualisationPhoto && (
                    <div>
                      <Photos
                        showPhoto={showPhoto}
                        filterPhoto={filterPhoto}
                        setPublication={setPublication}
                      />
                      {mobileEmojis.map((emoji) => (
                        <div
                          key={emoji.id}
                          style={{
                            position: "absolute",
                            left: emoji.x, //position de l'emoji horizontale
                            top: emoji.y, //position de l'emoji verticale
                            fontSize: "24px", //taille de l'emoji
                            cursor: "move", //curseur indiquant que l'emoji est déplaçable
                          }}
                          draggable //rendre l'emoji déplaçable
                          onDragEnd={(e) => {
                            // fonction de déplacement de l'emoji
                            //calcul de la nouvelle position de l'emoji
                            const newX = e.clientX - e.target.offsetWidth / 2;
                            const newY = e.clientY - e.target.offsetHeight / 2;
                            moveMobileEmoji(emoji.id, newX, newY); //fonction de mise à jour de la position de l'emoji
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
                    <FilterImage ChangeFilter={ChangeFilter} />
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
                          name=""
                          id=""
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
    </div>
  );
};

export default Status;
