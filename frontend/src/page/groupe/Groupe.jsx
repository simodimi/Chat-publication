import React from "react";
import nomane from "../../assets/icone/personne.jpeg";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import "./groupe.css";
import { FaStar } from "react-icons/fa";
import { group } from "../groupe/Testgroup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Groupe = () => {
  const [Selcet, setSelcet] = useState(null);
  const [joingroup, setjoingroup] = useState(false);
  const [addgroup, setaddgroup] = useState(true);
  const [waiting, setwaiting] = useState(true);
  const [hiddengroup, sethiddengroup] = useState(false);
  const toggle = (id) => {
    //setSelcet((prev) => ({ ...prev, [id]: !prev[id] })); selection et deselection plusieur elt.
    setSelcet(id === Selcet ? null : id); //selection et deselection d'un element à la fois
  };
  //joindre un groupe
  const handlejoingroup = () => {
    setaddgroup(false);
    setjoingroup((prev) => !prev);
    sethiddengroup((prev) => !prev);
    document.querySelector("#ButtonMenuAddgroup").style.display = "none";
  };
  //annuler
  const handlecancel = () => {
    document.querySelector("#ButtonMenuAddgroup").style.display = "block";
    setjoingroup((prev) => !prev);
    sethiddengroup((prev) => !prev);
  };
  //recherche
  const [searchgroup, setSearchgroup] = useState("");
  const handleGroupChange = (e) => {
    setSearchgroup(e.target.value);
  };
  const filtergroup = group.filter((p) => {
    return (
      p.title.toLowerCase().includes(searchgroup.toLowerCase()) ||
      p.description.toLowerCase().includes(searchgroup.toLowerCase())
    );
  });
  return (
    <div className="AppelHome">
      <div className="AppelHomeLeft">
        <p id="Appel">Mes Groupes</p>

        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher un  groupe"
            type="search"
            value={searchgroup}
            onChange={handleGroupChange}
          />
        </Box>
        <div className="ShowAppel">
          <div className="AppelContact">
            <div className="GroupeSearch">
              {filtergroup.length > 0 ? (
                filtergroup.map((p) => (
                  <div
                    className={`AppelContacts ${
                      Selcet === p.id ? "Appelselects" : ""
                    } `}
                    style={{ display: "flex" }}
                    onClick={() => toggle(p.id)}
                    key={p.id}
                  >
                    <div className="AppelContactImg">
                      <img src={p.photo} alt="" />
                    </div>
                    <div className="AppelName">
                      <div className="AppelNameLeft">
                        <p>{p.title} </p>
                        <p>{p.description} </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun groupe trouvé</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="AppelHomeRight">
        <p id="Appel">rechercher des nouveaux groupes</p>
        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher un  groupe"
          />
        </Box>
        <div className="NameInfosCall">
          <div className="NameInfosCallUp">
            <div className="CallUpLeft">
              <img src={nomane} alt="" />
              <div className="">
                <p>Groupe alimentaire</p>
                <span>histoire de sorcellerie</span>
              </div>
            </div>
            <div className="CallUpRight">
              <div className="ButtonMenu" id="ButtonMenuAddgroup">
                <p
                  style={{
                    margin: "auto",
                  }}
                  onClick={() => handlejoingroup()}
                >
                  rejoindre le groupe
                </p>
              </div>
              {hiddengroup ? (
                <div className="">
                  {addgroup ? (
                    <div className="ButtonMenu">
                      <p
                        style={{
                          margin: "auto",
                        }}
                      >
                        quitter le groupe
                      </p>
                    </div>
                  ) : (
                    <p
                      className="ButtonMenu"
                      style={{
                        margin: "auto",
                      }}
                      onClick={() => handlecancel()}
                    >
                      annuler la demande
                    </p>
                  )}
                </div>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className="NameInfosCallDown">
            {joingroup ? (
              <div className="CallDownLefts">
                <div className="CallDownLeftsText">
                  {waiting ? (
                    <p>En attente d'acceptation</p>
                  ) : (
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      Menbre du groupe <FaStar color="yellow" />{" "}
                    </p>
                  )}
                </div>
                <span>
                  <AiOutlineLoading3Quarters id="loading" />
                </span>
              </div>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Groupe;
