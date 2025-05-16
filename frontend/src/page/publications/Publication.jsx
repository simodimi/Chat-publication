import React, { useEffect, useRef, useState } from "react";
import "./publication.css";
import { IoSend } from "react-icons/io5";
import noname from "../../assets/icone/personne.jpeg";
import { FaCirclePlus } from "react-icons/fa6";
import { MdMenu } from "react-icons/md";
import { CiSaveDown2 } from "react-icons/ci";
import { MdAppBlocking } from "react-icons/md";
import { SiAdblock } from "react-icons/si";
import { FaMasksTheater } from "react-icons/fa6";
import { AiTwotoneLike } from "react-icons/ai";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdPhotos } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import Emoji from "../../component/Emoji";
import Publier from "./Publier";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaMusic } from "react-icons/fa";
import { toast } from "react-toastify";
import CreateGroupModal from "../../component/CreateGroupModal";

const Publication = () => {
  // États pour les publications
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentPublication, setCurrentPublication] = useState(null);

  // États pour les commentaires et likes
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [menuStates, setMenuStates] = useState({});
  const [writeStates, setWriteStates] = useState({});
  const [writeAreas, setWriteAreas] = useState({});
  const [photoComment, setphotoComment] = useState(null);
  const [emojis, setEmoji] = useState({});

  const ref = useRef(null);
  const refcomment = useRef(null);
  const [ProfilePicture, setProfilePicture] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("Photo de profil chargée:", parsedUser.photo_profil); // Pour le débogage
      return parsedUser.photo_profil || noname;
    }
    return noname;
  });

  // Récupération des données utilisateur depuis le localStorage
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("Données utilisateur chargées:", parsedUser); // Pour le débogage
      return parsedUser;
    }
    return null;
  });

  // Mise à jour de l'état quand les données utilisateur changent
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("Données utilisateur mises à jour:", parsedUser); // Pour le débogage
      setUserData(parsedUser);
    }
  }, []);

  // Mise à jour de l'état quand les données utilisateur changent
  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log("Photo de profil mise à jour:", parsedUser.photo_profil); // Pour le débogage
      setProfilePicture(parsedUser.photo_profil || noname);
    }
  }, []);

  // Fonction pour récupérer les publications
  const fetchPublications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/publications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des publications");
      }

      const data = await response.json();
      setPublications(data);
      setError(null);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les publications au montage du composant
  useEffect(() => {
    fetchPublications();
  }, []);

  // Mettre à jour les publications toutes les 3 secondes
  useEffect(() => {
    const interval = setInterval(fetchPublications, 3000);
    return () => clearInterval(interval);
  }, []);

  // Gestion de la publication
  const handlePublish = async (publication) => {
    try {
      const response = await fetch("http://localhost:5000/api/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          texte: publication.text,
          media: publication.media,
          audio: publication.audio,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la publication");
      }

      const newPublication = await response.json();
      setPublications((prev) => [newPublication, ...prev]);
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast.error("Erreur lors de la création de la publication");
    }
  };

  // Gestion de la suppression d'une publication
  const handleDeletePublication = async (id_publication) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/publications/${id_publication}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la publication");
      }

      setPublications((prev) =>
        prev.filter((pub) => pub.id_publication !== id_publication)
      );
      toast.success("Publication supprimée avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression de la publication");
    }
  };

  // Gestion de la visionneuse de médias
  const openMediaViewer = (publication, index) => {
    setSelectedPublication(publication);
    setCurrentMediaIndex(index);
    setMediaViewerOpen(true);
  };

  const nextMedia = () => {
    if (selectedPublication) {
      setCurrentMediaIndex(
        (prev) => (prev + 1) % selectedPublication.media.length
      );
    }
  };

  const prevMedia = () => {
    if (selectedPublication) {
      setCurrentMediaIndex(
        (prev) =>
          (prev - 1 + selectedPublication.media.length) %
          selectedPublication.media.length
      );
    }
  };

  // Fonctions existantes
  const ChangeProfile = () => {
    ref.current.click();
  };

  const HandleProfile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        // Limite de 5MB
        const formData = new FormData();
        formData.append("photo_profil", file);

        try {
          const response = await fetch(
            `http://localhost:5000/api/users/${userData.id_utilisateur}/photo`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("Erreur du serveur:", data);
            toast.error(
              data.message || "Erreur lors de la mise à jour de la photo"
            );
            return;
          }

          // Mise à jour du localStorage avec la nouvelle photo
          const updatedUser = {
            ...userData,
            photo_profil: data.photo_profil,
          };
          localStorage.setItem("userData", JSON.stringify(updatedUser));
          setUserData(updatedUser);
          setProfilePicture(data.photo_profil);
          toast.success("Photo de profil mise à jour avec succès");
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la photo:", error);
          toast.error(
            "Erreur lors de la mise à jour de la photo. Veuillez réessayer."
          );
        }
      } else {
        toast.error("Veuillez choisir un fichier de moins de 5MB");
      }
    }
  };

  // Gestion des likes
  const handleLike = (publicationId, commentId = null) => {
    if (commentId) {
      // Like d'un commentaire
      setComments((prev) => {
        const updatedComments = { ...prev };
        const updateComment = (commentsArray) => {
          return commentsArray.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: (comment.likes || 0) + (comment.isLiked ? -1 : 1),
                isLiked: !comment.isLiked,
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComment(comment.replies),
              };
            }
            return comment;
          });
        };

        if (updatedComments[publicationId]) {
          updatedComments[publicationId] = updateComment(
            updatedComments[publicationId]
          );
        }
        return updatedComments;
      });
    } else {
      // Like d'une publication
      setLikes((prev) => ({
        ...prev,
        [publicationId]: {
          count:
            (prev[publicationId]?.count || 0) +
            (prev[publicationId]?.isLiked ? -1 : 1),
          isLiked: !prev[publicationId]?.isLiked,
        },
      }));
    }
  };

  // Gestion du texte des commentaires
  const handleWriteAreaChange = (publicationId, value) => {
    setWriteAreas((prev) => ({
      ...prev,
      [publicationId]: value,
    }));
  };

  // Ajout d'un commentaire
  const addComment = (publicationId, parentCommentId = null) => {
    const text = writeAreas[publicationId];
    if (!text?.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      text: text.trim(),
      author: "Dimitri",
      authorPicture: ProfilePicture,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      photo: photoComment,
      replies: [],
    };

    setComments((prev) => {
      const publicationComments = prev[publicationId] || [];

      if (parentCommentId) {
        // Ajouter une réponse à un commentaire existant
        const updateReplies = (comments) => {
          return comments.map((comment) => {
            if (comment.id === parentCommentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateReplies(comment.replies),
              };
            }
            return comment;
          });
        };

        return {
          ...prev,
          [publicationId]: updateReplies(publicationComments),
        };
      } else {
        // Ajouter un nouveau commentaire principal
        return {
          ...prev,
          [publicationId]: [...publicationComments, newComment],
        };
      }
    });

    // Réinitialiser uniquement la zone de texte de cette publication
    setWriteAreas((prev) => ({
      ...prev,
      [publicationId]: "",
    }));
    setphotoComment(null);
    setWriteStates((prev) => ({
      ...prev,
      [publicationId]: false,
    }));
  };

  // Gestion du menu pour chaque publication
  const toggleMenu = (publicationId) => {
    setMenuStates((prev) => ({
      ...prev,
      [publicationId]: !prev[publicationId],
    }));
  };

  // Gestion de l'écriture de commentaire pour chaque publication
  const toggleWrite = (publicationId) => {
    setWriteStates((prev) => ({
      ...prev,
      [publicationId]: !prev[publicationId],
    }));
    setCurrentPublication(publicationId);
  };

  // Gestion des emojis pour chaque publication
  const toggleEmoji = (publicationId) => {
    setEmoji((prev) => ({
      ...prev,
      [publicationId]: !prev[publicationId],
    }));
  };

  // Gestion des emojis
  const handleEmojiClick = (emoji, publicationId) => {
    setWriteAreas((prev) => ({
      ...prev,
      [publicationId]: (prev[publicationId] || "") + emoji.emoji,
    }));
  };

  const showImage = () => {
    refcomment.current.click();
  };

  const handleCommentPicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size <= 1 * 1024 * 1024) {
        const dimi = new FileReader();
        dimi.onloadend = () => {
          setphotoComment(dimi.result);
        };
        dimi.readAsDataURL(file);
        setWriteAreas((prev) => ({
          ...prev,
          [currentPublication]: prev[currentPublication] + file.name,
        }));
      }
    }
  };

  const maxlength = 600;
  const [isexpand, setisexpand] = useState({});

  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <div className="PublicationHome">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Chargement des publications...</div>
      ) : (
        <>
          <div className="PublicationTitle">
            <div className="PublicationTitle-Img">
              <img
                src={userData?.photo_profil || ProfilePicture || noname}
                alt="Photo de profil"
                onClick={() => ChangeProfile()}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <input
                type="file"
                name="photo_profil"
                accept="image/*"
                ref={ref}
                onChange={HandleProfile}
                style={{ display: "none" }}
              />
              <p>{userData?.name_utilisateur || "Utilisateur"}</p>
            </div>
            <div className="PublicationTitle-Selection">
              <Publier onPublish={handlePublish} />
              {/*  <div
                className="CreateGroupe"
                onClick={() => setShowCreateGroup(true)}
              >
                <p>Créer un groupe</p>
                <span>
                  <FaCirclePlus />
                </span>
              </div>*/}
            </div>
          </div>

          <div className="PublicationShow">
            {publications.map((publication) => (
              <div key={publication.id_publication} className="PublicationPost">
                <div className="PublicationPost-Menu">
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      src={
                        publication.user?.photo_profil
                          ? publication.user.photo_profil.startsWith("http")
                            ? publication.user.photo_profil
                            : `http://localhost:5000/${publication.user.photo_profil}`
                          : noname
                      }
                      alt="Photo de profil"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    {publication.user?.name_utilisateur}
                  </p>
                  {publication.id_utilisateur === userData?.id_utilisateur && (
                    <div className="PublicationPost-Menu-Icon">
                      <span>
                        <MdMenu
                          onClick={() => toggleMenu(publication.id_publication)}
                          style={{ cursor: "pointer" }}
                          className="ButtonMenu"
                        />
                      </span>
                      {menuStates[publication.id_publication] && (
                        <div className="ListPublicationPost">
                          <p
                            onClick={() =>
                              handleDeletePublication(
                                publication.id_publication
                              )
                            }
                          >
                            <MdAppBlocking />
                            <span>Supprimer la publication</span>
                          </p>
                          <p>
                            <CiSaveDown2 />
                            <span>Enregistrer la publication</span>
                          </p>
                          <p>
                            <FaMasksTheater />
                            <span>masquer la publication</span>
                          </p>
                          <p>
                            <SiAdblock />
                            <span>signaler la publication</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="TextePublication">
                  <div className="HeaderPublication">
                    <p>
                      {publication.texte.length > maxlength &&
                      !isexpand[publication.id_publication]
                        ? `${publication.texte.slice(0, maxlength)}...`
                        : publication.texte}
                    </p>
                    {publication.texte.length > maxlength && (
                      <div className="HeaderPublication-Text">
                        <span
                          onClick={() =>
                            setisexpand((prev) => ({
                              ...prev,
                              [publication.id_publication]:
                                !prev[publication.id_publication],
                            }))
                          }
                        >
                          {isexpand[publication.id_publication]
                            ? "Lire moins..."
                            : "Lire la suite..."}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="HealthPublication">
                    {publication.media.length > 0 && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            publication.media.length === 1
                              ? "1fr"
                              : "repeat(2, 1fr)",
                          gap: "8px",
                          height: "100%",
                        }}
                      >
                        {publication.media.map((media, mediaIndex) => (
                          <div
                            key={mediaIndex}
                            style={{
                              gridColumn:
                                publication.media.length === 1
                                  ? "span 2"
                                  : "auto",
                              cursor: "pointer",
                              position: "relative",
                              height: "100%",
                            }}
                            onClick={() =>
                              openMediaViewer(publication, mediaIndex)
                            }
                          >
                            {media.type === "image" ? (
                              <img
                                src={media.url}
                                alt=""
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <video
                                src={media.url}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                muted
                              />
                            )}
                            {publication.media.length > 2 &&
                              mediaIndex === 1 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: "rgba(0,0,0,0.6)",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  + {publication.media.length - 2}
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                    {publication.audio.length > 0 && (
                      <div style={{ padding: "16px" }}>
                        {publication.audio.map((audio, audioIndex) => (
                          <div
                            key={audioIndex}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              padding: "8px",
                              backgroundColor: "#f5f5f5",
                              borderRadius: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            <FaMusic />
                            <span>{audio.name}</span>
                            <audio
                              controls
                              src={audio.url}
                              style={{ flex: 1 }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="LikingPublication">
                    <div className="LikingUp">
                      <p>
                        <AiTwotoneLike id="like" />
                        <span>
                          {likes[publication.id_publication]?.count || 0}
                        </span>
                      </p>
                      <p>
                        {comments[publication.id_publication]?.length || 0}{" "}
                        commentaire
                        {comments[publication.id_publication]?.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                    <div className="LikingDown">
                      <p onClick={() => handleLike(publication.id_publication)}>
                        <AiTwotoneLike id="likes" />
                        Like
                      </p>
                      <p
                        onClick={() => toggleWrite(publication.id_publication)}
                      >
                        <FaRegMessage id="likes" /> Commenter
                      </p>
                    </div>
                  </div>
                </div>

                {/* Zone de commentaires */}
                <div className="CommentArea">
                  {comments[publication.id_publication]?.map((comment) => (
                    <div key={comment.id} className="Comment">
                      <div className="CommentContent">
                        <img src={comment.authorPicture} alt="" />
                        <div>
                          <p className="CommentAuthor">{comment.author}</p>
                          <p className="CommentText">{comment.text}</p>
                          {comment.photo && (
                            <img
                              src={comment.photo}
                              alt=""
                              className="CommentPhoto"
                            />
                          )}
                        </div>
                      </div>

                      <div className="CommentActions">
                        <p
                          onClick={() =>
                            handleLike(publication.id_publication, comment.id)
                          }
                        >
                          <AiTwotoneLike /> Like{" "}
                          {comment.likes > 0 && comment.likes}
                        </p>
                        <p
                          onClick={() =>
                            toggleWrite(publication.id_publication)
                          }
                        >
                          <FaRegMessage /> Répondre
                        </p>
                      </div>

                      {/* Réponses au commentaire */}
                      {comment.replies?.length > 0 && (
                        <div className="Replies">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="Comment">
                              <div className="CommentContent">
                                <img src={reply.authorPicture} alt="" />
                                <div>
                                  <p className="CommentAuthor">
                                    {reply.author}
                                  </p>
                                  <p className="CommentText">{reply.text}</p>
                                  {reply.photo && (
                                    <img
                                      src={reply.photo}
                                      alt=""
                                      className="CommentPhoto"
                                    />
                                  )}
                                </div>
                              </div>
                              <div className="CommentActions">
                                <p
                                  onClick={() =>
                                    handleLike(
                                      publication.id_publication,
                                      reply.id
                                    )
                                  }
                                >
                                  <AiTwotoneLike /> Like{" "}
                                  {reply.likes > 0 && reply.likes}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Zone d'écriture des commentaires */}
                {writeStates[publication.id_publication] && (
                  <div className="PublicationCommentaire">
                    <div className="WrittingPrincipalComment">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          addComment(publication.id_publication);
                        }}
                      >
                        <textarea
                          value={writeAreas[publication.id_publication] || ""}
                          onChange={(e) =>
                            handleWriteAreaChange(
                              publication.id_publication,
                              e.target.value
                            )
                          }
                          placeholder="Écrivez un commentaire..."
                        />
                        <div className="OptionComment">
                          <p>
                            <span>
                              <input
                                type="file"
                                accept="image/*"
                                ref={refcomment}
                                onChange={handleCommentPicture}
                                style={{ display: "none" }}
                              />
                              <IoMdPhotos
                                onClick={showImage}
                                className="ButtonMenu"
                              />
                            </span>
                            <span>
                              <MdEmojiEmotions
                                onClick={() =>
                                  toggleEmoji(publication.id_publication)
                                }
                                className="ButtonMenu"
                              />
                              {emojis[publication.id_publication] && (
                                <div className="" id="emoji">
                                  <Emoji
                                    handleEmojiClick={(emoji) =>
                                      handleEmojiClick(
                                        emoji,
                                        publication.id_publication
                                      )
                                    }
                                  />
                                </div>
                              )}
                            </span>
                          </p>
                          <button type="submit">
                            <IoSend className="ButtonMenu" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Visionneuse de médias */}
          <Dialog
            open={mediaViewerOpen}
            onClose={() => setMediaViewerOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogContent
              style={{ position: "relative", textAlign: "center" }}
            >
              <IconButton
                onClick={prevMedia}
                style={{ position: "absolute", left: 10, top: "50%" }}
              >
                <FaChevronLeft />
              </IconButton>
              {selectedPublication?.media[currentMediaIndex]?.type ===
              "image" ? (
                <img
                  src={selectedPublication?.media[currentMediaIndex]?.url}
                  alt=""
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              ) : (
                <video
                  src={selectedPublication?.media[currentMediaIndex]?.url}
                  controls
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              )}
              <IconButton
                onClick={nextMedia}
                style={{ position: "absolute", right: 10, top: "50%" }}
              >
                <FaChevronRight />
              </IconButton>
            </DialogContent>
          </Dialog>

          {/*  <CreateGroupModal
            open={showCreateGroup}
            onClose={() => setShowCreateGroup(false)}
            onGroupCreated={(group) => {
              // Redirection vers la page des groupes après création
              window.location.href = "/groupe";
            }}
          />*/}
        </>
      )}
    </div>
  );
};

export default Publication;
