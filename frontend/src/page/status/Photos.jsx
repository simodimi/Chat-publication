/**
 * Composant Photos - Permet de sélectionner et afficher des photos pour les statuts
 * @param {Function} setMenuaction - Fonction pour gérer l'état du menu
 * @param {boolean} menuaction - État du menu
 * @param {boolean} SeeButton - État de visibilité du bouton
 * @param {Function} setSeeButton - Fonction pour gérer la visibilité du bouton
 */
import React, { useEffect } from "react";
import "./status.css";
import { useState } from "react";

const Photos = ({
  showPhoto,
  filterPhoto,
  setPublication,
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
}) => {
  // État pour stocker l'image sélectionnée
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (showPhoto) {
      const dimi = showPhoto.length;
      if (dimi > 0) {
        setPublication(true);
      } else {
        setPublication(false);
      }
    }
  }, [showPhoto]);

  /**
   * Gère la sélection d'une image
   * @param {Event} event - Événement de sélection de fichier
   */
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        // Cacher le menu après la sélection
        setMenuaction(false);
        setSeeButton(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="WriteSmsCalles">
      <div className="showScreens">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Photo sélectionnée"
            className="showScreenImg"
            style={{ filter: filterPhoto }}
            onError={(e) => {
              console.error("Erreur de chargement de la vidéo", e);
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
            }}
          >
            Sélectionner une photo...
          </p>
        )}
      </div>

      {/* Input pour sélectionner une image */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: "none" }}
        id="photoInput"
      />

      {/* Bouton pour ouvrir le sélecteur de fichiers */}
      <div className="StartCamera">
        <button
          onClick={() => document.getElementById("photoInput").click()}
          className="ButtonMenu"
        >
          Choisir une photo
        </button>
      </div>

      {/* Bouton pour réinitialiser la sélection */}
      {selectedImage && (
        <button onClick={() => setSelectedImage(null)} className="ButtonMenu">
          Changer de photo
        </button>
      )}
    </div>
  );
};

export default Photos;
