/**
 * Composant FilterImage - Permet d'appliquer des filtres aux images des statuts
 * @param {Function} setMenuaction - Fonction pour gérer l'état du menu
 * @param {boolean} menuaction - État du menu
 * @param {boolean} SeeButton - État de visibilité du bouton
 * @param {Function} setSeeButton - Fonction pour gérer la visibilité du bouton
 * @param {Function} setFilter - Fonction pour définir le filtre sélectionné
 */
import React from "react";
import "./status.css";
import { filtre } from "./test";

const FilterImage = ({
  setMenuaction,
  menuaction,
  SeeButton,
  setSeeButton,
  setFilter,
}) => {
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
