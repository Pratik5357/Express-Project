const Listing = require("../models/Listings");

module.exports.Index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
};

module.exports.createListingForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you are accessing does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    let { listing } = req.body;
    
    // Ensure numeric
    if (listing.lat && listing.lng) {
        listing.lat = parseFloat(listing.lat);
        listing.lng = parseFloat(listing.lng);
    }

    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: "Point",
        coordinates: [listing.lng, listing.lat]
    };

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are accessing does not exist");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const { listing } = req.body;

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listing }, { new: true });

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
    }

    if (listing.lat && listing.lng) {
        updatedListing.geometry = {
            type: "Point",
            coordinates: [listing.lng, listing.lat]
        };
    }

    await updatedListing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.searchListing = async (req, res) => {
    let { query } = req.query;

    if (!query || query.trim() === "") {
        req.flash("error", "Please enter a search term.");
        return res.redirect("/listings");
    }

    let searchResults = await Listing.find({
        title: { $regex: query, $options: "i" }
    });

    res.render("listings/index.ejs", {
        allListings: searchResults,
        searchQuery: query
    });
};
