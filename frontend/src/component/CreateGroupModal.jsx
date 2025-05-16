import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

const CreateGroupModal = ({ open, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || !description.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom_groupe: groupName,
          description: description,
          createur_id: user.id_utilisateur,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de la création du groupe"
        );
      }

      const data = await response.json();
      console.log("Groupe créé avec succès:", data);
      onGroupCreated(data);
      onClose();
      setGroupName("");
      setDescription("");
    } catch (error) {
      console.error("Erreur:", error);
      alert(error.message || "Erreur lors de la création du groupe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "16px",
        },
      }}
    >
      <DialogTitle sx={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Créer un nouveau groupe
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nom du groupe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              fullWidth
              variant="outlined"
              placeholder="Entrez le nom du groupe"
            />
            <TextField
              label="Objectif du groupe"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              placeholder="Décrivez l'objectif de votre groupe"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={onClose}
            disabled={loading}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              padding: "8px 16px",
            }}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              padding: "8px 16px",
            }}
          >
            {loading ? "Création..." : "Créer le groupe"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateGroupModal;
