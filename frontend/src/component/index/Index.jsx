import React, { useState } from "react";
import "./index.css";
import tof1 from "../../assets/social.png";
import tof2 from "../../assets/menuwhat.png";
import tof3 from "../../assets/message.png";
import tof4 from "../../assets/telep.png";
import tof5 from "../../assets/circle.png";
import tof6 from "../../assets/publication.png";
import tof7 from "../../assets/ami.png";
import tof8 from "../../assets/etoile.png";
import tof9 from "../../assets/archive.png";
import tof10 from "../../assets/para.png";
import tof11 from "../../assets/groupe-80.png";
import { Link } from "react-router-dom";
const Index = ({ UpdateWidth, UpdateWidths }) => {
  const [Choix, setChoix] = useState("");
  const [showtext, setshowtext] = useState(true);
  const SeeShowDescription = () => {
    setshowtext(!showtext);
    if (showtext) {
      UpdateWidth();
    } else {
      UpdateWidths();
    }
  };

  return (
    <div className="IndexHome">
      <div className="IndexHomeLogo">
        <div className="iconehaut">
          <img src={tof1} alt="logo" />
          {showtext && <p>Sim'Soxial</p>}
        </div>
        <div className="IndexHomeButton">
          <div className="IndexHomeUp">
            <div className="iconeDescriptions">
              <img
                src={tof2}
                alt="logo"
                onClick={() => {
                  SeeShowDescription();
                }}
                style={{ cursor: "pointer" }}
              />
              {showtext && <p className="ShowDescription">Menu</p>}
              <div className="textAfficher">
                <p>Menu</p>
              </div>
            </div>

            <div
              onClick={() => setChoix("message")}
              className={Choix === "message" ? "active" : ""}
            >
              <Link to="/message">
                <div className="iconeDescription">
                  <img src={tof3} alt="logo" />
                  {showtext && <p className="ShowDescription">Messages</p>}
                  <div className="textAfficher">
                    <p>Messages</p>
                  </div>
                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("appel")}
              className={Choix === "appel" ? "active" : ""}
            >
              <Link to="/appel">
                <div className="iconeDescription">
                  <img src={tof4} alt="logo" />
                  {showtext && <p className="ShowDescription">Appels</p>}

                  <div className="textAfficher">
                    <p>Appels</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("status")}
              className={Choix === "status" ? "active" : ""}
            >
              <Link to="/status">
                <div className="iconeDescription">
                  <img src={tof5} alt="logo" />
                  {showtext && <p className="ShowDescription">status</p>}

                  <div className="textAfficher">
                    <p>Status</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("publication")}
              className={Choix === "publication" ? "active" : ""}
            >
              <Link to="/">
                <div className="iconeDescription">
                  <img src={tof6} alt="logo" />
                  {showtext && <p className="ShowDescription">publications</p>}
                  <div className="textAfficher">
                    <p>Publications</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("amis")}
              className={Choix === "amis" ? "active" : ""}
            >
              <Link to="/amis">
                <div className="iconeDescription">
                  <img src={tof7} alt="logo" />
                  {showtext && <p className="ShowDescription">ami(e)s</p>}
                  <div className="textAfficher">
                    <p>Ami(e)s</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("groupe")}
              className={Choix === "groupe" ? "active" : ""}
            >
              <Link to="/groupe">
                <div className="iconeDescription">
                  <img src={tof11} alt="logo" />
                  {showtext && <p className="ShowDescription">groupes</p>}
                  <div className="textAfficher">
                    <p>Groupes</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="IndexHomeDown">
            <div
              onClick={() => setChoix("important")}
              className={Choix === "important" ? "active" : ""}
            >
              <Link to="/important">
                <div className="iconeDescription">
                  <img src={tof8} alt="logo" />
                  {showtext && <p className="ShowDescription">importants</p>}
                  <div className="textAfficher">
                    <p>important</p>
                  </div>

                  <div className="textCompteur">
                    <p>10</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("archive")}
              className={Choix === "archive" ? "active" : ""}
            >
              <Link to="/archive">
                <div className="iconeDescription">
                  <img src={tof9} alt="logo" />
                  {showtext && <p className="ShowDescription">archives</p>}
                  <div className="textAfficher">
                    <p>Archives</p>
                  </div>
                </div>
              </Link>
            </div>
            <div
              onClick={() => setChoix("parametre")}
              className={Choix === "parametre" ? "active" : ""}
            >
              <Link to="/parametre">
                <div className="iconeDescription">
                  <img src={tof10} alt="logo" />
                  {showtext && <p className="ShowDescription">paramètres</p>}
                  <div className="textAfficher">
                    <p>paramètres</p>
                  </div>
                </div>
              </Link>
            </div>

            <Link to="/profil">
              <div className="profilpicture">
                <img src={tof6} alt="" />
                <div className="profilAfficher">
                  <p>profil</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
