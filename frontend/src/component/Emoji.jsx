import React from "react";
import EmojiPicker from "emoji-picker-react";

const Emoji = ({ handleEmojiClick }) => {
  return (
    <div
      className="EmojiHome"
      style={{
        cursor: "pointer",
        scrollbarWidth: "thin",
        scrollbarColor: "gainsboro white",
      }}
    >
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  );
};

export default Emoji;
