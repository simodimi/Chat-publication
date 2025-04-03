import React, { useEffect, useRef } from "react";
import "./status.css";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";

const Emoji = ({ onEmojiSelect }) => {
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
      {seeEmoji && (
        <div className="EmojiHomes" ref={ref}>
          <EmojiPicker onEmojiClick={(e) => onEmojiSelect(e.emoji)} />
        </div>
      )}
    </div>
  );
};

export default Emoji;
