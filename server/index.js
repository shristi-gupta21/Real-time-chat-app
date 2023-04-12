const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let userData = new Map();
let disuserData = new Map();
let chatuser = new Map();
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join_room", (data) => {
    userData.set(socket.id, { ...data, id: socket.id });
    socket.join(data.room);
    socket.join(socket.id);
    let array = [];
    for (let [key, value] of userData) {
      array.push(value);
    }
    io.to(data.room).emit("send_data", array);
  });
  console.log("userData", userData);

  socket.on("users", (data) => {
    socket.emit("usersinfo", data);
  });

  socket.on("send_msg", (data) => {
    chatuser.set(socket.id, data);
    console.log("chatuser", data);
    socket.to(data.socketid).emit("recieve_msg", data);
    socket.to(data.socketid).emit("notification", data);
  });

  socket.on("read", (data) => {});

  socket.on("disconnect", () => {
    const roomId = userData?.get(socket.id);
    disuserData.set(socket.id, roomId?.name);
    userData.delete(socket.id);
    let array = [];
    let array2 = [];
    for (let [key, value] of userData) {
      array.push(value);
    }
    for (let [key, value] of disuserData) {
      value !== undefined ? array2.push(value) : "";
    }
    io.to(roomId?.room).emit("send_data", array);
    socket.to(roomId?.room).emit("online", array2);
  });
});

httpServer.listen(3001, () => {
  console.log("Server Running");
});
