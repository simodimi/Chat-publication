import React from "react";
import { couleur } from "./test";

const StyleBackground = ({ ChangeColorText }) => {
  return (
    <div className="ViewOption">
      <div className="ViewOptionSelection">
        {couleur.map((p) => (
          <div className="CallOption">
            <p>
              <span
                className="ButtonMenu"
                onClick={() => ChangeColorText(p.couleur)}
                style={{
                  backgroundColor: p.couleur,
                  width: "50px",
                  height: "30px",
                }}
              ></span>
              <label>{p.nom}</label>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleBackground;
