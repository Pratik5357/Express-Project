const Listing = require("../models/Listings");

module.exports.Index = async (req,res)=>{
    let allListings = await Listing.find({})
    res.render("./listings/index.ejs",{allListings});
};

module.exports.createListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
    if(!listing){
       req.flash("error","Listing you are accessing is not exist");
       res.redirect("/listings");  
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let {listing} = req.body;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");   
    res.redirect("/listings");
};

module.exports.editListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error","Listing you are accessing is not exist");
       res.redirect("/listings");  
    }
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(req.body.listing);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");   
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");   
    res.redirect("/listings");
};

 