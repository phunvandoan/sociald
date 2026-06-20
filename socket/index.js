const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
    // origin: "https://social-d.vercel.app",
  },
});

let users = [];

// ======================
// USER HELPERS
// ======================

const addUser = (userId, socketId) => {
  const userExists = users.find((u) => u.userId === userId);

  if (!userExists) {
    users.push({
      userId,
      socketId,
    });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const getUsersByMembers = (members) => {
  return users.filter((user) => members.includes(user.userId));
};

// ======================
// SOCKET
// ======================

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ======================
  // ADD USER
  // ======================

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);

    console.log("Online Users:", users);

    io.emit("getUsers", users);
  });

  // ======================
  // PRIVATE MESSAGE
  // ======================

  socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
    const receiver = getUser(receiverId);

    if (!receiver) {
      console.log("Receiver offline:", receiverId);
      return;
    }

    io.to(receiver.socketId).emit("getMessage", {
      senderId,
      text,
      conversationId,
    });

    console.log(`[PRIVATE] ${senderId} -> ${receiverId}: ${text}`);
  });

  // ======================
  // GROUP MESSAGE
  // ======================

  socket.on(
    "sendGroupMessage",
    ({ senderId, members, text, conversationId }) => {
      const receivers = getUsersByMembers(members);

      receivers.forEach((receiver) => {
        if (receiver.userId === senderId) return;

        io.to(receiver.socketId).emit("getMessage", {
          senderId,
          text,
          conversationId,
        });
      });

      console.log(`[GROUP ${conversationId}] ${senderId}: ${text}`);
    },
  );

  // ======================
  // DISCONNECT
  // ======================

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    removeUser(socket.id);

    io.emit("getUsers", users);
  });
});
