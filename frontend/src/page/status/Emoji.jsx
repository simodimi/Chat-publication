/**
 * Composant Emoji - Permet d'ajouter des émojis dans les statuts
 * @param {Function} setMenuaction - Fonction pour gérer l'état du menu
 * @param {boolean} menuaction - État du menu
 * @param {boolean} SeeButton - État de visibilité du bouton
 * @param {Function} setSeeButton - Fonction pour gérer la visibilité du bouton
 * @param {Function} setSelectedEmoji - Fonction pour définir l'émoji sélectionné
 */
import React, { useEffect, useRef } from "react";
import "./status.css";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

const Emoji = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
  setSelectedEmoji,
}) => {
  // Liste des émojis disponibles
  const emojis = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
  ];

  /**
   * Gère la sélection d'un émoji
   * @param {string} emoji - L'émoji sélectionné
   */
  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
    // Cacher le menu après la sélection
    setMenuaction(false);
    setSeeButton(false);
  };

  const ref = useRef(null);
  const [seeEmoji, setseeEmoji] = useState(true);
  useEffect(() => {
    const disappear = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        //si la ref existe et que ce n est pas dans son périmetre d action
        setseeEmoji(false);
      }
    };
    document.addEventListener("mousedown", disappear);
    return () => {
      document.removeEventListener("mousedown", disappear);
    };
  }, [ref]);

  return (
    <div className="WriteSmsCallx">
      {/* Grille d'émojis */}
      <div className="emoji-grid">
        {emojis.map((emoji, index) => (
          <button
            key={index}
            className="emoji-button"
            onClick={() => handleEmojiSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Bouton pour fermer le menu */}
      <div className="StartCamera">
        <button
          onClick={() => {
            setMenuaction(false);
            setSeeButton(false);
          }}
          className="ButtonMenu"
        >
          Fermer
        </button>
      </div>

      {seeEmoji && (
        <div className="EmojiHomes" ref={ref}>
          <EmojiPicker onEmojiClick={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default Emoji;
