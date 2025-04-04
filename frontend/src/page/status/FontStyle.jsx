import React from "react";
import { font } from "./test";

const FontStyle = ({ ChangeFontText }) => {
  return (
    <div className="ViewOption">
      <div className="ViewOptionSelection">
        {font.map((p) => (
          <div className="CallOption">
            <p>
              <span
                className="ButtonMenu"
                onClick={() => ChangeFontText(p.font)}
              >
                {p.font}
              </span>
              <label>{p.nom}</label>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontStyle;
