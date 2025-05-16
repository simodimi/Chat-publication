import React from "react";
import "./status.css";
import { filtre } from "./test";

const FilterImage = ({ setMenuaction, setSeeButton, setFilter }) => {
  const handleFilterSelect = (filterValue) => {
    setFilter(filterValue);
    // Cacher le menu après la sélection
    setMenuaction(false);
    setSeeButton(false);
  };

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
    </div>
  );
};

export default FilterImage;
