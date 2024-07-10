const mongoose = require("mongoose");
const initData = require("./data.js");
const Lising = require("../models/Listings.js");

main().then(()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
});

async function main() {     
    mongoose.connect("mongodb://127.0.0.1:27017/Travelling-app");
}


const initDB = async ()=>{
    await Lising.deleteMany({});
    initData.data = initData.data.map((obj)=>({
        ...obj , owner: "668801cfc8bdfafeb48b175c",
    }));
    await Lising.insertMany(initData.data);
    console.log("database initialized");
}

initDB();