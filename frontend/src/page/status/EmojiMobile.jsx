import React from "react";
import { emoji } from "./test";

const EmojiMobile = ({ onEmojSelect }) => {
  return (
    <div className="ViewOption">
      <div className="ViewOptionSelection">
        {emoji.map((p) => (
          <div className="CallOption">
            <p>
              <span
                className="ButtonMenu"
                onClick={() => {
                  onEmojSelect(p.emoji);
                }}
                style={{
                  backgroundColor: p.couleur,
                  width: "50px",
                  height: "30px",
                  fontSize: "25px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {p.emoji}
              </span>
              <label>{p.nom}</label>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmojiMobile;
