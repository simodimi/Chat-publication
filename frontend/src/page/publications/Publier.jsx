import React, { useState, useRef } from "react";
import { FaPenAlt } from "react-icons/fa";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { IoMdPhotos } from "react-icons/io";
import { MdEmojiEmotions } from "react-icons/md";
import { FaMusic } from "react-icons/fa";
import Emoji from "../../component/Emoji";

const Publier = ({ onPublish }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [audio, setAudio] = useState([]);
  const [emojis, setEmojis] = useState(false);
  const mediaRef = useRef(null);
  const audioRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setText("");
    setMedia([]);
    setAudio([]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleEmojiClick = (e) => {
    setText((prev) => prev + e.emoji);
  };

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAudio = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setAudio((prev) => [...prev, ...newAudio]);
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(media[index].url);
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const removeAudio = (index) => {
    URL.revokeObjectURL(audio[index].url);
    setAudio((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (text.trim() || media.length > 0 || audio.length > 0) {
      onPublish({
        text: text.trim(),
        media: media.map((m) => ({
          type: m.type,
          url: m.url,
        })),
        audio: audio.map((a) => ({
          name: a.name,
          url: a.url,
        })),
      });
      handleClose();
    }
  };

  return (
    <>
      <div className="CreateGroupe" onClick={handleOpen}>
        <p>Créer une publication</p>
        <span>
          <FaPenAlt />
        </span>
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Créer une publication</DialogTitle>
        <DialogContent>
          <TextField
            spellCheck
            autoFocus
            margin="dense"
            label="Que souhaitez-vous partager ?"
            type="text"
            multiline
            fullWidth
            rows={6}
            value={text}
            onChange={handleTextChange}
            className="CreateGroupeInput"
            sx={{
              scrollbarWidth: "thin",
              scrollbarColor: "gainsboro  rgba(102, 145, 211, 0.2)",

              "& .MuiInputBase-input": { color: "white" },
            }}
          />

          {media.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h4>Médias sélectionnés :</h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {media.map((m, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    {m.type === "image" ? (
                      <img
                        src={m.url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <video
                        src={m.url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        muted
                      />
                    )}
                    <IconButton
                      onClick={() => removeMedia(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        color: "white",
                      }}
                    >
                      ×
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          )}

          {audio.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h4>Fichiers audio sélectionnés :</h4>
              <div style={{ marginTop: "8px" }}>
                {audio.map((a, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <FaMusic />
                    <span>{a.name}</span>
                    <audio controls src={a.url} style={{ flex: 1 }} />
                    <IconButton
                      onClick={() => removeAudio(index)}
                      style={{
                        backgroundColor: "rgba(0,0,0,0.1)",
                      }}
                    >
                      ×
                    </IconButton>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <div style={{ display: "flex", gap: "8px", marginRight: "auto" }}>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: "none" }}
              ref={mediaRef}
              onChange={handleMediaUpload}
            />
            <IconButton onClick={() => mediaRef.current.click()}>
              <IoMdPhotos />
            </IconButton>
            <input
              type="file"
              accept="audio/*"
              multiple
              style={{ display: "none" }}
              ref={audioRef}
              onChange={handleAudioUpload}
            />
            <IconButton onClick={() => audioRef.current.click()}>
              <FaMusic />
            </IconButton>
            <IconButton onClick={() => setEmojis(!emojis)}>
              <MdEmojiEmotions />
            </IconButton>
            {emojis && (
              <div style={{ position: "absolute", bottom: "100%", left: 0 }}>
                <Emoji handleEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            color="primary"
            disabled={!text.trim() && media.length === 0 && audio.length === 0}
          >
            Publier
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Publier;
