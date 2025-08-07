const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
const path = require("path");
const loginRouter = require("./controllers/login");
const usersRouters = require("./controllers/users"); 
const servicesRouter = require("./controllers/services");
const { userExtractor } = require("./middleware/auth");
const logoutRouter = require("./controllers/logout");
const { MONGO_URI } = require("./config");
const {PAGE_URL} = require("./config");


(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();

//Middleware
app.use(cors({
  origin: PAGE_URL,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Rutas BackEnd

app.use("/api/users", usersRouters);
app.use("/api/login", loginRouter); 
app.use("/api/logout", logoutRouter); 
app.use("/api/cuenta", userExtractor , servicesRouter); 

// Rutas FrontEnd
app.use("/", express.static(path.join(__dirname, "views", "home")));
app.use('/styles', express.static(path.join(__dirname, "views", "styles")));
app.use('/verify/:id/:token', express.static(path.join(__dirname, "views", "verify")));
app.use("/signup", express.static(path.join(__dirname, "views", "signup")));
app.use("/login", express.static(path.join(__dirname, "views", "login")));
app.use("/cuenta", express.static(path.join(__dirname, "views", "cuenta")));
app.use("/servicios", express.static(path.join(__dirname, "views", "servicios")));
app.use("/components", express.static(path.join(__dirname, "views", "components")));
app.use('/img', express.static(__dirname + '/img'));
app.use('/video', express.static(path.join(__dirname, 'video')));
app.use('/verify/:token', express.static(path.resolve( "views", "verify")));

//Morgan
app.use(morgan('tiny'))



module.exports = app;