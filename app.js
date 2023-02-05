const express = require('express');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const debug = require("debug")("weblog-project");


const path = require('path');
const indexRoutes = require('./routes/index.js');
const connectDB = require('./config/db.js');
const logger = require("./config/winston.js");
const dashboard = require('./routes/Dashboard.js');
const RegisterRoute = require('./routes/Register.js');
const errorController = require('./controllers/errorController.js');


//Load-Config
dotEnv.config({
    path: "./config/config.env",
});

//DataBase-Connection
connectDB();
debug("Connected to DataBase!");



//Passport Configuration
require("./config/passport.js");

const app = express();

if(process.env.NODE_ENV == "development"){
    debug("Morgan Enabled!");
    app.use(morgan("combined",{ stream: logger.stream }));
}

//View-Engin
app.use(expressLayouts);
app.set("view engin","ejs");
app.set("layout","./layouts/mainLayout.ejs");
app.set("views","views");


//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


/////Session 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
}));


//Passport
app.use(passport.initialize());
app.use(passport.session());



//Connect Flash
app.use(flash());


//Static-Folder
app.use(express.static(path.join(__dirname,"public")));



//Routes
app.use("/",indexRoutes);
app.use("/users",RegisterRoute);
app.use("/dashboard",dashboard);


//Error 404
app.use(errorController.get404);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is Running in ${process.env.NODE_ENV} mode!`);
});