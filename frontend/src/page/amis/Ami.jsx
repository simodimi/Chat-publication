import React, { useState, useEffect } from "react";
import nomane from "../../assets/icone/personne.jpeg";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "./ami.css";
import { FaStar } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

const Ami = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendsSearchQuery, setFriendsSearchQuery] = useState("");
  const [contactsSearchQuery, setContactsSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState({});
  const [requestStatus, setRequestStatus] = useState({});
  const [currentLoadingId, setCurrentLoadingId] = useState(null);

  useEffect(() => {
    console.log("État de l'utilisateur:", user);
    if (user) {
      console.log("Utilisateur connecté, chargement des données...");
      loadFriends();
      loadFriendRequests();
      loadPendingRequests();
      setupSocket();
    } else {
      console.log("Aucun utilisateur connecté");
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  const setupSocket = () => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("friendRequest", (data) => {
      toast.info(`Nouvelle demande d'ami de ${data.sender.name_utilisateur}`);
      loadFriendRequests();
    });

    newSocket.on("friendRequestAccepted", (data) => {
      toast.success(
        `${data.friend.name_utilisateur} a accepté votre demande d'ami`
      );
      loadFriends();
      setPendingRequests(
        pendingRequests.filter(
          (req) => req.receiverId !== data.friend.id_utilisateur
        )
      );
    });

    newSocket.on("friendRequestRejected", (data) => {
      toast.warning(
        `${data.receiver.name_utilisateur} a refusé votre demande d'ami`
      );
      setPendingRequests(
        pendingRequests.filter(
          (req) => req.receiverId !== data.receiver.id_utilisateur
        )
      );
    });

    newSocket.on("friendRequestCancelled", (data) => {
      toast.info(`${data.sender.name_utilisateur} a annulé sa demande d'ami`);
      setPendingRequests(
        pendingRequests.filter((req) => req.id !== data.requestId)
      );
    });

    newSocket.on("friendRemoved", (data) => {
      toast.info(`${data.friend.name_utilisateur} n'est plus votre ami`);
      loadFriends();
    });
  };

  const loadFriends = async () => {
    if (!user?.id_utilisateur) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/friends/${user.id_utilisateur}`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Erreur lors du chargement des amis:", error);
      toast.error("Erreur lors du chargement des amis");
    }
  };

  const loadFriendRequests = async () => {
    if (!user?.id_utilisateur) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/friend-requests/${user.id_utilisateur}`
      );
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      setFriendRequests(data);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes:", error);
      //toast.error("Erreur lors du chargement des demandes");
    }
  };

  const loadPendingRequests = async () => {
    if (!user?.id_utilisateur) {
      console.log("Pas d'utilisateur connecté pour charger les demandes");
      return;
    }

    try {
      console.log(
        "Chargement des demandes en attente pour l'utilisateur:",
        user.id_utilisateur
      );
      const response = await fetch(
        `http://localhost:5000/api/users/pending-requests/${user.id_utilisateur}`
      );
      console.log(
        "Réponse du serveur pour les demandes en attente:",
        response.status
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Données des demandes en attente reçues:", data);

      setPendingRequests(data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des demandes en attente:",
        error
      );
      toast.error("Erreur lors du chargement des demandes en attente");
    }
  };

  const handleSearchFriends = (e) => {
    const query = e.target.value.toLowerCase();
    setFriendsSearchQuery(query);

    if (query.length > 0) {
      const filteredFriends = friends.filter((friend) =>
        friend.name_utilisateur.toLowerCase().includes(query)
      );
      setFriends(filteredFriends);
    } else {
      loadFriends();
    }
  };

  const handleSearchContacts = async (e) => {
    const query = e.target.value;
    setContactsSearchQuery(query);

    if (query.length > 0) {
      try {
        const searchUrl = `http://localhost:5000/api/users/search?q=${encodeURIComponent(
          query
        )}`;
        const response = await fetch(searchUrl);

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        // Filtrer l'utilisateur actuel des résultats
        const filteredUsers = data.filter(
          (u) => u.id_utilisateur !== user?.id_utilisateur
        );

        setSearchResults(filteredUsers);
      } catch (error) {
        console.error("Erreur lors de la recherche:", error);
        toast.error("Erreur lors de la recherche des contacts");
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = async (userId) => {
    console.log("clicked", userId);
    console.log("État de l'utilisateur lors du clic:", user);

    if (!user?.id_utilisateur) {
      console.log("Pas d'utilisateur connecté");
      toast.error("Vous devez être connecté pour envoyer une demande d'ami");
      return;
    }

    try {
      // Mise à jour immédiate de l'état
      const tempId = Date.now();
      console.log("Ajout d'une demande temporaire avec ID:", tempId);
      setPendingRequests((prev) => {
        const newRequests = [...prev, { id: tempId, receiverId: userId }];
        console.log(
          "Nouveaux pendingRequests après ajout temporaire:",
          newRequests
        );
        return newRequests;
      });
      setCurrentLoadingId(userId);
      setRequestStatus((prev) => ({ ...prev, [userId]: "sending" }));

      console.log("Envoi de la demande au serveur...");
      console.log("Données envoyées:", {
        senderId: user.id_utilisateur,
        receiverId: userId,
      });

      const response = await fetch(
        "http://localhost:5000/api/users/friend-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderId: user.id_utilisateur,
            receiverId: userId,
          }),
        }
      );

      console.log("Réponse du serveur reçue:", response.status);
      const data = await response.json();
      console.log("Données reçues du serveur:", data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      // Mise à jour avec l'ID réel du serveur
      setPendingRequests((prev) => {
        const newRequests = prev.map((req) =>
          req.receiverId === userId
            ? {
                id: data.id,
                receiverId: data.receiver.id_utilisateur,
              }
            : req
        );
        console.log(
          "Nouveaux pendingRequests après mise à jour avec l'ID réel:",
          newRequests
        );
        return newRequests;
      });
      setRequestStatus((prev) => ({ ...prev, [userId]: "pending" }));

      // Recharger les demandes en attente
      console.log("Rechargement des demandes en attente...");
      await loadPendingRequests();

      toast.success("Demande d'ami envoyée");
    } catch (error) {
      console.error("Erreur détaillée lors de l'envoi de la demande:", error);
      setPendingRequests((prev) => {
        const newRequests = prev.filter((req) => req.receiverId !== userId);
        console.log("Nouveaux pendingRequests après erreur:", newRequests);
        return newRequests;
      });
      setRequestStatus((prev) => ({ ...prev, [userId]: "error" }));
      toast.error(error.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setCurrentLoadingId(null);
    }
  };

  const handleCancelRequest = async (requestId, userId) => {
    console.log(
      "Annulation de la demande:",
      requestId,
      "pour l'utilisateur:",
      userId
    );
    try {
      setRequestStatus((prev) => ({ ...prev, [userId]: "loading" }));

      const response = await fetch(
        `http://localhost:5000/api/users/friend-request/${requestId}/cancel`,
        {
          method: "DELETE",
        }
      );

      console.log("Réponse du serveur pour l'annulation:", response.status);
      const data = await response.json();
      console.log("Données reçues du serveur:", data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur HTTP: ${response.status}`);
      }

      // Mettre à jour l'état local
      setPendingRequests((prev) => prev.filter((req) => req.id !== requestId));
      setRequestStatus((prev) => ({ ...prev, [userId]: "idle" }));

      // Recharger les demandes en attente
      await loadPendingRequests();

      toast.success("Demande d'ami annulée");
    } catch (error) {
      console.error("Erreur lors de l'annulation de la demande:", error);
      setRequestStatus((prev) => ({ ...prev, [userId]: "error" }));
      toast.error(error.message || "Erreur lors de l'annulation de la demande");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setRequestStatus((prev) => ({ ...prev, [requestId]: "loading" }));
      const response = await fetch(
        `http://localhost:5000/api/users/friend-request/${requestId}/accept`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Demande d'ami acceptée");
      loadFriends();
      loadFriendRequests();
      setRequestStatus((prev) => ({ ...prev, [requestId]: "accepted" }));
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      setRequestStatus((prev) => ({ ...prev, [requestId]: "error" }));
      toast.error("Erreur lors de l'acceptation de la demande");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setRequestStatus((prev) => ({ ...prev, [requestId]: "loading" }));
      const response = await fetch(
        `http://localhost:5000/api/users/friend-request/${requestId}/reject`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Demande d'ami refusée");
      loadFriendRequests();
      setRequestStatus((prev) => ({ ...prev, [requestId]: "rejected" }));
    } catch (error) {
      console.error("Erreur lors du refus de la demande:", error);
      setRequestStatus((prev) => ({ ...prev, [requestId]: "error" }));
      toast.error("Erreur lors du refus de la demande");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!user?.id_utilisateur) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/friends/${user.id_utilisateur}/${friendId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      toast.success("Ami supprimé avec succès");
      loadFriends();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'ami:", error);
      toast.error("Erreur lors de la suppression de l'ami");
    }
  };

  return (
    <div className="AppelHome">
      <div className="AppelHomeLeft">
        <p id="Appel">Mes Ami(es)</p>

        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher parmi mes amis"
            type="search"
            value={friendsSearchQuery}
            onChange={handleSearchFriends}
          />
        </Box>

        {/* Section des demandes d'amitié reçues */}
        {friendRequests.length > 0 && (
          <div className="FriendRequestsSection">
            <p id="Appel">Demandes d'amitié reçues</p>
            <div className="AppelContact">
              {friendRequests.map((request) => (
                <div className="AppelContacts" key={request.id}>
                  <div className="AppelContactImg">
                    <img src={request.sender.photo_profil || nomane} alt="" />
                  </div>
                  <div className="AppelName">
                    <div className="AppelNameLeft">
                      <p>{request.sender.name_utilisateur}</p>
                    </div>
                    <div className="AppelNameRight">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={requestStatus[request.id] === "loading"}
                      >
                        {requestStatus[request.id] === "loading" ? (
                          <AiOutlineLoading3Quarters id="loadings" />
                        ) : (
                          "Accepter"
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={requestStatus[request.id] === "loading"}
                      >
                        {requestStatus[request.id] === "loading" ? (
                          <AiOutlineLoading3Quarters id="loadings" />
                        ) : (
                          "Refuser"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="ShowAppel">
          <div className="AppelContact">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div
                  className={`AppelContacts ${
                    selectedUser === friend.id_utilisateur ? "Appelselects" : ""
                  }`}
                  key={friend.id_utilisateur}
                  onClick={() => setSelectedUser(friend.id_utilisateur)}
                >
                  <div className="AppelContactImg">
                    <img src={friend.photo_profil || nomane} alt="" />
                  </div>
                  <div className="AppelName">
                    <div className="AppelNameLeft">
                      <p>{friend.name_utilisateur}</p>
                    </div>
                    <div className="AppelNameRight">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFriend(friend.id_utilisateur);
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Aucun ami trouvé</p>
            )}
          </div>
        </div>
      </div>
      <div className="AppelHomeRight">
        <p id="Appel">Rechercher des contacts</p>
        <Box className="SearchCommunication">
          <TextField
            helperText=" "
            className="SearchCommunicationInput"
            id="demo-helper-text-aligned-no-helper"
            label="Rechercher un contact"
            value={contactsSearchQuery}
            onChange={handleSearchContacts}
          />
        </Box>
        <div className="NameInfosCall">
          {searchResults.length > 0 ? (
            searchResults.map((user) => {
              console.log("Rendu pour l'utilisateur:", user.id_utilisateur);
              console.log("pendingRequests actuel:", pendingRequests);
              const pendingRequest = pendingRequests.find(
                (req) => req.receiverId === user.id_utilisateur
              );
              console.log("pendingRequest trouvé:", pendingRequest);
              const isFriend = friends.some(
                (friend) => friend.id_utilisateur === user.id_utilisateur
              );
              const status = requestStatus[user.id_utilisateur] || "idle";
              const isLoading = currentLoadingId === user.id_utilisateur;

              return (
                <div key={user.id_utilisateur} className="NameInfosCallUp">
                  <div className="CallUpLeft">
                    <img
                      src={
                        user.photo_profil
                          ? `http://localhost:5000/${user.photo_profil.replace(
                              /\\/g,
                              "/"
                            )}`
                          : nomane
                      }
                      alt=""
                    />
                    <p>{user.name_utilisateur}</p>
                  </div>
                  <div className="CallUpRight">
                    <div className="ButtonMenu" id="ButtonMenuAddgroup">
                      <p style={{ margin: "auto" }}>
                        {isLoading ? (
                          <span
                            style={{
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <span>Envoi en cours...</span>
                            <AiOutlineLoading3Quarters id="loadings" />
                          </span>
                        ) : isFriend ? (
                          <span>Vous êtes amis</span>
                        ) : pendingRequest || status === "pending" ? (
                          <span
                            style={{
                              display: "flex",
                              gap: "5px",
                              alignItems: "center",
                            }}
                          >
                            <span
                              onClick={() =>
                                handleCancelRequest(
                                  pendingRequest?.id,
                                  user.id_utilisateur
                                )
                              }
                              style={{ cursor: "pointer" }}
                            >
                              Annuler la demande
                            </span>
                            {status === "loading" && (
                              <AiOutlineLoading3Quarters id="loadings" />
                            )}
                          </span>
                        ) : (
                          <span
                            onClick={() =>
                              handleSendFriendRequest(user.id_utilisateur)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            Demande d'amitié
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Aucun contact trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ami;
