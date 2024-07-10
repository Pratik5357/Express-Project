const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync.js");

const Listing = require("../models/Listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


// Listing route
router.route("/").get(wrapAsync(listingController.Index))
                 .post( isLoggedIn, upload.single('listing[image]'), validateListing,wrapAsync(listingController.createListing));  

//new routes
router.get("/new",isLoggedIn, listingController.createListingForm);

router.route("/:id").get(wrapAsync(listingController.showListing))
/*update route*/    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
/*delete route*/    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.editListing));
 



module.exports = router;