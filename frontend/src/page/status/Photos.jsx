import React, { useEffect, useRef } from "react";
import "./status.css";
import { useState } from "react";
import Draggable from "react-draggable";

const Photos = ({
  filterPhoto,
  setPublication,
  mobileEmojis,
  setMobileEmojis,
}) => {
  // État pour stocker l'image sélectionnée
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      setPublication(true);
    } else {
      setPublication(false);
      setMobileEmojis([]);
    }
  }, [selectedImage]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
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
      <div className="showScreens" ref={containerRef}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Photo sélectionnée"
            style={{ filter: filterPhoto }}
            onError={(e) => {
              console.error("Erreur de chargement de la vidéo", e);
              alert("la photo n'a pas pu être chargée");
            }}
          />
        ) : (
          <p>Sélectionner une photo...</p>
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

      {/* Input pour sélectionner une image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: "none" }}
        id="photoInput"
        ref={refimage}
      />

      <div className="AddPicturesPhoto" onClick={handlechoicephoto}>
        <>
          {!selectedImage ? (
            <span>Ajouter une photo</span>
          ) : (
            <span>Remplacer la photo</span>
          )}
        </>
      </div>
    </div>
  );
};

export default Photos;
