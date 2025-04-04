import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  IoCall,
  IoVideocam,
  IoMic,
  IoMicOff,
  IoVideocamOff,
  IoVideocamOutline,
  IoCallOutline,
  IoShareSocial,
  IoPeople,
  IoClose,
} from "react-icons/io5";
import io from "socket.io-client";
import "./call.css";
import { CiSquarePlus } from "react-icons/ci";
//url du serveur
const socket = io("http://localhost:3001");

const Call = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type, user } = location.state || {};
  const [roomId, setRoomId] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [close, setClose] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const localVideoRef = useRef(null);
  const screenShareRef = useRef(null);
  const callContainerRef = useRef(null);

  useEffect(() => {
    if (!type || !user) {
      navigate("/message");
      return;
    }

    // Initialiser la connexion WebRTC ici
    startLocalStream();
    return () => {
      stopLocalStream();
    };
  }, [type, user, navigate]);

  const startLocalStream = async () => {
    try {
      const constraints = {
        audio: true,
        video: type === "video",
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Erreur lors de l'accès aux médias:", error);
    }
  };

  const stopLocalStream = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      localVideoRef.current.srcObject
        .getTracks()
        .forEach((track) => track.stop());
      localVideoRef.current.srcObject = null;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = localVideoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = isMuted;
      }
    }
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = localVideoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = isVideoOff;
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Erreur lors du partage d'écran:", error);
      }
    } else {
      if (screenShareRef.current && screenShareRef.current.srcObject) {
        screenShareRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
        screenShareRef.current.srcObject = null;
      }
      setIsScreenSharing(false);
    }
  };

  const addParticipant = () => {
    // Logique pour ajouter un participant
  };

  const handleMouseDown = (e) => {
    if (close) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (close) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [close, isDragging, dragStart, position]);

  const endCall = () => {
    if (roomId) {
      // Logique pour quitter la salle
    }
    stopLocalStream();
    //navigate("/message", { state: { selectedUser: user } });
    navigate("/message", {
      state: {
        selectedUser: user,
        returnToConversation: true,
      },
    });
  };

  const resizeCall = () => {
    if (!close) {
      setClose(true);
      const callcontainer = callContainerRef.current;
      callcontainer.style.transition = "all 0.2s ease";
      /*callcontainer.style.position = "fixed";
      callcontainer.style.width = "300px";
      callcontainer.style.height = "200px"; */
      callcontainer.style.position = "static";
      callcontainer.style.width = "50%";
      callcontainer.style.height = "50%";
      callcontainer.style.top = "20px";
      callcontainer.style.right = "20px";
      callcontainer.style.zIndex = "1000";
    } else {
      setClose(false);
      const callcontainer = callContainerRef.current;
      callcontainer.style.transition = "all 0.2s ease";
      callcontainer.style.position = "fixed";
      callcontainer.style.top = "0";
      callcontainer.style.left = "0";
      callcontainer.style.width = "100%";
      callcontainer.style.height = "100%";
      callcontainer.style.zIndex = "1";
    }
  };

  return (
    <div
      className="call-container"
      ref={callContainerRef}
      onMouseDown={handleMouseDown}
      style={
        close
          ? { transform: `translate(${position.x}px, ${position.y}px)` }
          : {}
      }
    >
      <div className="call-header">
        <h2>
          {type === "video" ? "Appel vidéo" : "Appel vocal"} avec {user?.title}
        </h2>
        <button className="close-button" onClick={resizeCall}>
          {close ? <CiSquarePlus /> : <IoClose />}
        </button>
      </div>

      <div className="call-content">
        <div className="video-grid">
          <div className="local-video">
            <video ref={localVideoRef} autoPlay muted playsInline />
          </div>
          {isScreenSharing && (
            <div className="screen-share">
              <video ref={screenShareRef} autoPlay playsInline />
            </div>
          )}
          {participants.map((participant) => (
            <div key={participant.id} className="participant-video">
              <video srcObject={participant.stream} autoPlay playsInline />
            </div>
          ))}
        </div>

        <div className="call-controls">
          <button
            className={`control-button ${isMuted ? "active" : ""}`}
            onClick={toggleMute}
          >
            {isMuted ? <IoMicOff /> : <IoMic />}
          </button>
          {type === "video" && (
            <button
              className={`control-button ${isVideoOff ? "active" : ""}`}
              onClick={toggleVideo}
            >
              {isVideoOff ? <IoVideocamOff /> : <IoVideocam />}
            </button>
          )}
          <button
            className={`control-button ${isScreenSharing ? "active" : ""}`}
            onClick={toggleScreenShare}
          >
            <IoShareSocial />
          </button>
          <button className="control-button" onClick={addParticipant}>
            <IoPeople />
          </button>
          <button className="end-call-button" onClick={endCall}>
            {type === "video" ? <IoVideocamOff /> : <IoCallOutline />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Call;
