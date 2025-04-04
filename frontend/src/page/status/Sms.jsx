import React, { useState, useEffect } from "react";
import "./status.css";
import Draggable from "react-draggable"; // Importation de la bibliothèque draggable

const Sms = ({
  selectedEmoji,
  colorText,
  bgtext,
  taille,
  font,
  setPublication,
  isMobileEmojiMode,
}) => {
  const [value, setValue] = useState(""); // État pour le texte du message
  const [mobileEmojis, setMobileEmojis] = useState([]); // État pour les emojis mobiles

  // Fonction pour changer le texte
  const ChangeText = (e) => {
    const dimi = e.target.value;
    setValue(dimi);
  };

  // Effet pour ajouter un emoji sélectionné au texte
  useEffect(() => {
    if (selectedEmoji) {
      if (isMobileEmojiMode) {
        addMobileEmoji(selectedEmoji);
      } else {
        setValue((prevValue) => prevValue + selectedEmoji);
      }
    }
  }, [selectedEmoji, isMobileEmojiMode]);

  // Fonction pour ajouter un emoji mobile
  const addMobileEmoji = (emoji) => {
    setMobileEmojis([...mobileEmojis, { id: Date.now(), emoji, x: 0, y: 0 }]);
  };

  // Fonction pour déplacer un emoji mobile
  const moveMobileEmoji = (id, newX, newY) => {
    setMobileEmojis(
      mobileEmojis.map((emoji) =>
        emoji.id === id ? { ...emoji, x: newX, y: newY } : emoji
      )
    );
  };

  // Fonction pour supprimer un emoji mobile
  const deleteMobileEmoji = (id) => {
    setMobileEmojis(mobileEmojis.filter((emoji) => emoji.id !== id));
  };
  //voir le composant publication
  useEffect(() => {
    const dimi = value.length;
    if (dimi > 0) {
      setPublication(true);
    } else {
      setPublication(false);
    }
  }, [value]);

  return (
    <div className="WriteSmsCall">
      <div className="showScreen" style={{ backgroundImage: bgtext }}>
        <pre
          style={{
            color: colorText,
            fontSize: taille,
            fontFamily: font,
            padding: "0px 10px",
          }}
        >
          {value}
        </pre>
        {/* Rendu des emojis mobiles */}
        {mobileEmojis.map((emoji) => (
          <Draggable
            key={emoji.id}
            defaultPosition={{ x: emoji.x, y: emoji.y }}
            //Cet événement est déclenché lorsque l'utilisateur termine le déplacement d'un élément draggable
            // e evenement de la souris et data un objet contenant des informations sur la position de l'élément après le déplacement,
            onStop={(e, data) => moveMobileEmoji(emoji.id, data.x, data.y)}
          >
            <div
              style={{ position: "absolute", fontSize: "24px", cursor: "move" }}
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
                X {/* Bouton de suppression */}
              </button>
            </div>
          </Draggable>
        ))}
      </div>
      <textarea
        name=""
        id=""
        onChange={ChangeText}
        value={value}
        placeholder="Ecrivez un message"
        spellCheck="true" // Pour activer la correction automatique
      ></textarea>
    </div>
  );
};

export default Sms;
