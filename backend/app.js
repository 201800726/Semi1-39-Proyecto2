const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const userRouter = require("./routes/user.route");
const postRouter = require("./routes/post.route");
const friendshipRouter = require("./routes/friendship.route");
const messagesRouter = require("./routes/message.route");

//config
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

//routes
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/friend", friendshipRouter);
app.use("/message", messagesRouter);

const server = app.listen(PORT, () => {
  console.log(`Server on port: ${PORT}`);
});

app.get("/", function (req, res) {
  res.send({
    Proyecto: "U-Social",
    Curso: "Laboratorio de Seminario 1",
    "Integrantes 1": "Maria Reneé Juaréz Albizures - 201800726",
    "Integrante 2": "Stefany Samantha Abigail Coromac Huezo - 201801182",
    "# Pareja": "39",
  });
});

/* SOCKETS */
const db = require("./database/database");
const SocketIO = require("socket.io");
const io = SocketIO(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`a wild ${socket.id} just arrived`);

  socket.on("message:client", (data) => {
    const query = `insert into MENSAJE(message,date,time,emisor,receptor)
    values ('${data.message}','${data.date}','${data.time}','${data.emisor}','${data.receptor}');`;

    db.query(query, (err, res) => {
      if (err) {
        console.log(err);
      }
    });
    console.log(query);
    io.sockets.emit("message:server", "Mensajes");
  });
});
