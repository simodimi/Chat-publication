import React, { useEffect, useRef } from "react";
import "./status.css";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

const Emoji = ({ onEmojiSelect }) => {
  const ref = useRef(null);
  const [seeEmoji, setSeeEmoji] = useState(true);

  useEffect(() => {
    const disappear = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        //si la ref existe et que ce n est pas dans son périmetre d action
        setSeeEmoji(false);
      }
    };
    document.addEventListener("mousedown", disappear);
    return () => {
      document.removeEventListener("mousedown", disappear);
    };
  }, [ref]);

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji.emoji);
    setSeeEmoji(true); // Ferme le menu après la sélection
  };

  return (
    <div className="WriteSmsCallx">
      {seeEmoji && (
        <div className="EmojiHomes" ref={ref}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height="400px"
            searchDisabled={false}
            skinTonesDisabled={false}
            previewConfig={{
              showPreview: true,
              showEmoticon: true,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Emoji;
