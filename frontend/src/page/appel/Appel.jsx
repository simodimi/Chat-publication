import React from "react";
import nomane from "../../assets/icone/personne.jpeg";
import "./appel.css";
import { SlCallIn } from "react-icons/sl";
import { SlCallOut } from "react-icons/sl";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { MdSms } from "react-icons/md";
import { useState } from "react";

const Appel = () => {
  const [Selcet, setSelcet] = useState(false);

  return (
    <div className="AppelHome">
      <div className="AppelHomeLeft">
        <p id="Appel">Appels</p>

        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher un  contact"
          />
        </Box>
        <div className="ShowAppel">
          <p style={{ paddingLeft: "10px", margin: "0" }}>Récents:</p>
          <div className="AppelContact">
            <div
              className={`AppelContacts ${Selcet ? "Appelselects" : ""} `}
              style={{ display: "flex" }}
              onClick={() => setSelcet(!Selcet)}
            >
              <div className="AppelContactImg">
                <img src={nomane} alt="" />
              </div>
              <div className="AppelName">
                <div className="AppelNameLeft">
                  <p>Dimitri</p>
                  <p>
                    <span>
                      <SlCallIn /> Entrant
                    </span>
                    <span>
                      <SlCallOut /> Sortant
                    </span>
                  </p>
                </div>
                <div className="AppelTime">
                  <p>12:00</p>
                </div>
              </div>
            </div>
            <div className="AppelContacts" style={{ display: "flex" }}>
              <div className="AppelContactImg">
                <img src={nomane} alt="" />
              </div>
              <div className="AppelName">
                <div className="AppelNameLeft">
                  <p>Dimitri</p>
                  <p>
                    <span>
                      <SlCallIn /> Entrant
                    </span>
                    <span>
                      <SlCallOut /> Sortant
                    </span>
                  </p>
                </div>
                <div className="AppelTime">
                  <p>12:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="AppelHomeRight">
        <p id="Appel">infos de l'appel</p>
        <div className="NameInfosCall">
          <div className="NameInfosCallUp">
            <div className="CallUpLeft">
              <img src={nomane} alt="" />
              <p>Dimitri</p>
            </div>
            <div className="CallUpRight">
              <Link to="/message">
                <MdSms className="ButtonMenu" />
              </Link>
            </div>
          </div>
          <div className="NameInfosCallDown">
            <div className="CallDownLeft">
              <p>aujourd'hui</p>
              <p>
                appel vocal sortant à <span>12:00</span>
              </p>
            </div>
            <div className="CallDownRight">
              <p>Sans réponse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appel;
