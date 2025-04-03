import React, { useState, useEffect, useRef } from "react";
import "./status.css";
import Draggable from "react-draggable";

const Video = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
  filterPhoto,
  setPublication,
  mobileEmojis,
  setMobileEmojis,
}) => {
  // État pour stocker la vidéo sélectionnée
  const [selectedVideo, setSelectedVideo] = useState(null);
  // État pour gérer la lecture de la vidéo
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedVideo(videoUrl);
      // Cacher le menu après la sélection
      //setMenuaction(false);
      //setSeeButton(false);
    }
  };
  useEffect(() => {
    if (selectedVideo) {
      setPublication(true);
    } else {
      setPublication(false);
      setMobileEmojis([]);
    }
  }, [selectedVideo]);

  const refimage = useRef(null);
  const handlechoicephoto = () => {
    refimage.current.click();
  };
  const containerRef = useRef(null);
  const moveMobileEmoji = (id, newX, newY) => {
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

  return (
    <div className="WriteSmsCalles">
      {/* Zone d'affichage de la vidéo */}
      <div className="showScreens" ref={containerRef}>
        {selectedVideo ? (
          <video
            src={selectedVideo}
            alt="Photo sélectionnée"
            style={{ filter: filterPhoto }}
            onError={(e) => {
              console.error("Erreur de chargement de la vidéo", e);
              alert("la vidéo n'a pas pu être chargée");
            }}
            controls
            loop
          />
        ) : (
          <p>Sélectionner une vidéo...</p>
        )}

        {mobileEmojis.map((emoji) => (
          <Draggable
            key={emoji.id}
            position={{ x: emoji.x, y: emoji.y }}
            onStop={(e, data) => moveMobileEmoji(emoji.id, data.x, data.y)}
            bounds="parent" //limite
          >
            <div
              style={{
                position: "absolute",
                fontSize: "100px",
                cursor: "move",
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                gap: "5px",
                margin: "0px 0px ",
              }}
            >
              <span>{emoji.emoji}</span>
              <button
                onClick={() => deleteMobileEmoji(emoji.id)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                }}
              >
                X
              </button>
            </div>
          </Draggable>
        ))}
      </div>

      {/* Input pour sélectionner une vidéo */}
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        style={{ display: "none" }}
        //id="videoInput"
        id="photoInput"
        ref={refimage}
      />
      <div className="AddPicturesPhoto" onClick={handlechoicephoto}>
        <>
          {!selectedVideo ? (
            <span>Ajouter une vidéo</span>
          ) : (
            <span>Remplacer la vidéo</span>
          )}
        </>
      </div>
    </div>
  );
};

export default Video;
