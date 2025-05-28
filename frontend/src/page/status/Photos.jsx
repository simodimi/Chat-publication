import React from "react";
import "./status.css";

const Photos = ({ showPhoto, filterPhoto, setPublication, onPhotoSelect }) => {
  return (
    <div className="WriteSmsCalles">
      <div className="showScreens">
        {showPhoto ? (
          <img
            src={showPhoto}
            alt="Photo sélectionnée"
            className="showScreenImg"
            style={{ filter: filterPhoto }}
            onError={(e) => {
              console.error("Erreur de chargement de l'image", e);
              alert("la photo n'a pas pu être chargée");
            }}
          />
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            Sélectionner une photo...
          </p>
        )}
      </div>

      {/* Bouton pour ouvrir le sélecteur de fichiers */}
      <div className="StartCamera">
        <button onClick={onPhotoSelect} className="ButtonMenu">
          {showPhoto ? "Changer de photo" : "Ajouter une photo"}
        </button>
      </div>
    </div>
  );
};

export default Photos;
