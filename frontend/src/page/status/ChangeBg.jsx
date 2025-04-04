/**
 * Composant ChangeBg - Permet de changer le fond d'arrière-plan des statuts
 * @param {Function} Changebg - Fonction pour changer le fond d'arrière-plan
 */
import React from "react";
import { background } from "./test";

const ChangeBg = ({ Changebg }) => {
  return (
    <div className="ViewOption">
      <div className="ViewOptionSelection">
        {/* Liste des options de fond disponibles */}
        {background.map((p) => (
          <div className="CallOption">
            <p>
              {/* Bouton avec aperçu du fond */}
              <span
                className="ButtonMenu"
                onClick={() => {
                  Changebg(`url(${p.background})`);
                }}
                style={{
                  backgroundImage: `url(${p.background})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "50px",
                  height: "30px",
                }}
              ></span>
              {/* Label du fond */}
              <label>{p.nom}</label>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeBg;
