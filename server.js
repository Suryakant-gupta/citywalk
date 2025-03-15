const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const methodOverride = require("method-override");
const bodyParser = require('body-parser');
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const formRoutes = require('./routes/formRoutes')






dotenv.config();

const app = express();


// Set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: 'karyancitywalk',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
    // Use memory store (default)
  }));

// Set up rate limiter: maximum of 3 requests per 30 minutes per IP
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutes
    max: 3, // Limit each IP to 5 requests per windowMs
    message: "Too many submissions from this IP, please try again later."
});


// middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(flash());

// Middleware to make flash messages available to all views
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});



app.use("/", formRoutes);


app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: 'Server error' });
    }
});





// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
