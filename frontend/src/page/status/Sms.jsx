import React, { useState, useEffect } from "react";
import "./status.css";
const Sms = ({
  selectedEmoji,
  colorText,
  bgtext,
  taille,
  font,
  setPublication,
}) => {
  const [value, setValue] = useState("");

  const ChangeText = (e) => {
    const dimi = e.target.value;
    setValue(dimi);
  };

  useEffect(() => {
    if (selectedEmoji) {
      setValue((prevValue) => prevValue + selectedEmoji);
    }
  }, [selectedEmoji]);
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
          }}
        >
          {value}
        </pre>
      </div>
      <textarea
        name=""
        id=""
        onChange={ChangeText}
        value={value}
        placeholder="Ecrivez un message"
        spellCheck="true"
      ></textarea>
    </div>
  );
};

export default Sms;
