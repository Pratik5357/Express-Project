if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASBD_URL;
main().then(()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main() {     
    mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{console.log("some error is occured in mongo session store",err);});  
const sessionOption ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    }
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//demo user
app.get("/demouser",async (req,res)=>{
    const fakeUser = new User({
        email: "pkkumbhar1057@gmail.com",
        username: "pratik2024"
    });

    let registerdUser = await User.register(fakeUser , "pratik12345");
    res.send(registerdUser);
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",usersRouter);



// app.get("/testListings",async (req,res)=>{
//     let sampleListings = new Listing({
//         title: "New Villa",
//         description: "New Villa in the city",
//         price: 10000,
//         location: "solankur,Kolhapur",
//         contry: "India",
//     });
//     await sampleListings.save();
//     console.log("Listing is saved");  
//     res.send("testing successful");
// });

app.all("*",(req,res,next)=>{
    res.redirect("/listings");
});

app.use((err,req,res,next)=>{
    let {statusCode=500 , message="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
});
