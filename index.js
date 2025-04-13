require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movies");
const theatreRoutes = require("./routes/theatreRoutes");
const screenRoutes = require("./routes/screens");
const methodOverride = require("method-override");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected!");
});

app.use("/api/users", userRoutes);
app.use("/api/theatres", theatreRoutes);
app.use("/api/movies", movieRoutes);

app.use("/api/screens", screenRoutes);

app.use((req, res) => {
  res.status(404).send("Not found!");
});

app.listen(8080, () => {
  console.log("Listening to 8080 port");
});
