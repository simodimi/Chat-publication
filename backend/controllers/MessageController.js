const Message = require("../models/Message");
const User = require("../models/User");
const { Op, Sequelize } = require("sequelize");

// Envoyer un message
const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content, type, mediaUrl, replyTo } = req.body;

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      type,
      mediaUrl,
      replyTo,
    });

    // Récupérer les détails de l'expéditeur et du destinataire
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    // Émettre un événement Socket.IO pour le destinataire
    if (req.app.get("io")) {
      req.app
        .get("io")
        .to(`user_${receiverId}`)
        .emit("newMessage", {
          ...message.toJSON(),
          sender: {
            id: sender.id_utilisateur,
            name: sender.name_utilisateur,
            photo: sender.photo_profil,
          },
        });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    res.status(500).json({ message: "Erreur lors de l'envoi du message" });
  }
};

// Récupérer les messages entre deux utilisateurs
const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des messages" });
  }
};

// Marquer un message comme lu
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message non trouvé" });
    }

    if (message.receiverId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    // Émettre un événement Socket.IO pour l'expéditeur
    if (req.app.get("io")) {
      req.app.get("io").to(`user_${message.senderId}`).emit("messageRead", {
        messageId: message.id,
      });
    }

    res.json(message);
  } catch (error) {
    console.error("Erreur lors du marquage du message comme lu:", error);
    res
      .status(500)
      .json({ message: "Erreur lors du marquage du message comme lu" });
  }
};

// Récupérer les conversations récentes d'un utilisateur
const getRecentConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Récupérer les derniers messages pour chaque conversation
    const conversations = await Message.findAll({
      attributes: [
        "senderId",
        "receiverId",
        [Sequelize.fn("MAX", Sequelize.col("createdAt")), "lastMessageDate"],
      ],
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      group: ["senderId", "receiverId"],
      order: [[Sequelize.literal("lastMessageDate"), "DESC"]],
    });

    // Récupérer les détails des utilisateurs pour chaque conversation
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId =
          conv.senderId === parseInt(userId) ? conv.receiverId : conv.senderId;
        const user = await User.findByPk(otherUserId, {
          attributes: ["id_utilisateur", "name_utilisateur", "photo_profil"],
        });

        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: User,
              as: "sender",
              attributes: [
                "id_utilisateur",
                "name_utilisateur",
                "photo_profil",
              ],
            },
          ],
        });

        return {
          user,
          lastMessage,
        };
      })
    );

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des conversations" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessageAsRead,
  getRecentConversations,
};
