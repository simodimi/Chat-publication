import React from "react";
import "./status.css";

const Video = ({ showVideo, setPublication, onVideoSelect }) => {
  return (
    <div className="WriteSmsCalles">
      <div className="showScreens">
        {showVideo ? (
          <div className="video-container">
            <video
              id="statusVideo"
              src={showVideo}
              className="showScreenVideo"
              controls
              loop
              onError={(e) => {
                console.error("Erreur de chargement de la vidéo", e);
                alert("La vidéo n'a pas pu être chargée");
              }}
            />
          </div>
        ) : (
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            Sélectionner une vidéo...
          </p>
        )}
      </div>

      <div className="StartCamera">
        <button onClick={onVideoSelect} className="ButtonMenu">
          {showVideo ? "Changer de vidéo" : "Choisir une vidéo"}
        </button>
      </div>
    </div>
  );
};

export default Video;
