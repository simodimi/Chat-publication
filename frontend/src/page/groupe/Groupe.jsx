import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FaSearch, FaUserPlus, FaUserMinus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./groupe.css";

const Groupe = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false);
  const { user } = useAuth();

  const loadUserGroups = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/user/${user.id_utilisateur}`
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des groupes");
      const data = await response.json();
      setUserGroups(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const searchGroups = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/search?query=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Erreur lors de la recherche");
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id_utilisateur }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'adhésion au groupe");

      // Recharger les groupes de l'utilisateur
      loadUserGroups();
      // Mettre à jour les résultats de recherche
      searchGroups(searchQuery);
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'adhésion au groupe");
    }
  };

  const leaveGroup = async (groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/leave`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user.id_utilisateur }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors du désabonnement");

      // Recharger les groupes de l'utilisateur
      loadUserGroups();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors du désabonnement");
    }
  };

  const loadGroupDetails = async (groupId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des détails");
      const data = await response.json();
      setSelectedGroup(data);
      setShowGroupDetails(true);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchGroups(searchQuery);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div className="groupe-container">
      <div className="groupe-left">
        <h2>Mes Groupes</h2>
        {userGroups.map((group) => (
          <Card key={group.id_groupe} className="group-card">
            <CardContent>
              <Typography variant="h6">{group.nom_groupe}</Typography>
              <Typography color="textSecondary">{group.description}</Typography>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => leaveGroup(group.id_groupe)}
                >
                  <FaUserMinus style={{ marginRight: "8px" }} />
                  Se désabonner
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="groupe-right">
        <h2>Rechercher des Groupes</h2>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un groupe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <FaSearch style={{ marginRight: "8px" }} />,
          }}
        />

        {loading ? (
          <div id="loading">Chargement...</div>
        ) : (
          <div className="search-results">
            {searchResults.map((group) => (
              <Card key={group.id_groupe} className="group-card">
                <CardContent>
                  <Typography variant="h6">{group.nom_groupe}</Typography>
                  <Typography color="textSecondary">
                    {group.description}
                  </Typography>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => joinGroup(group.id_groupe)}
                    >
                      <FaUserPlus style={{ marginRight: "8px" }} />
                      Rejoindre
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={showGroupDetails}
        onClose={() => setShowGroupDetails(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedGroup && (
          <>
            <DialogTitle>{selectedGroup.nom_groupe}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedGroup.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Membres du groupe
              </Typography>
              <div className="members-list">
                {selectedGroup.membres?.map((member) => (
                  <div key={member.id_utilisateur} className="member-item">
                    <img
                      src={member.photo_profil || "/default-avatar.png"}
                      alt={member.nom_utilisateur}
                    />
                    <Typography>{member.nom_utilisateur}</Typography>
                  </div>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowGroupDetails(false)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default Groupe;
