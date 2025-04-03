import React from "react";
import "./status.css";
import { filtre } from "./test";

const FilterImage = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
  handleFilterSelect,
}) => {
  return (
    <div className="ViewOption">
      {/* Grille de filtres */}
      <div className="ViewOptionSelection">
        {filtre.map((filter) => (
          <div className="CallOption">
            <p>
              <span
                className="ButtonMenu"
                onClick={() => handleFilterSelect(filter.filter)}
                style={{
                  width: "50px",
                  height: "30px",
                  backgroundColor: filter.couleur,
                }}
              ></span>
              <label>{filter.nom}</label>
            </p>
          </div>
        ))}
      </div>

      {/* Bouton pour fermer le menu */}
      {/*  <div className="">
        <button
          onClick={() => {
            setMenuaction(false);
            setSeeButton(false);
          }}
          className="ButtonMenu"
        >
          Fermer
        </button>
      </div>*/}
    </div>
  );
};

export default FilterImage;
