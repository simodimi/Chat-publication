import React from "react";
import { taille } from "./test";

const Taille = ({ ChangeTailleText }) => {
  return (
    <div className="ViewOption">
      <div className="ViewOptionSelection">
        {taille.map((p) => (
          <div className="CallOption">
            <p>
              <span
                className="ButtonMenu"
                onClick={() => ChangeTailleText(p.taille)}
                style={{
                  backgroundColor: p.taille,
                }}
              >
                {p.taille}
              </span>
              <label>{p.label}</label>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Taille;
