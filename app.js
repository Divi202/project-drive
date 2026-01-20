const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const userRouter = require("./routes/user.routes");
const connectToDb = require("./config/db");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index.routes");

connectToDb();

const app = express();
const port = 3000;

//Build-in Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//Include ejs(HTML, CSS & JS files - Frontend)
app.set("view engine", "ejs");

// Default router
// app.get("/", (req, res) => {
//   //   res.send("index");
//   res.render("index.ejs");
// });

app.use("/", indexRouter);
app.use("/user", userRouter);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Execption");
  console.log(err);
});

app.listen(port, () => {
  console.log("Server is running on 3000 port");
});
