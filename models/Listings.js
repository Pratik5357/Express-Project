const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: String,
    description: String,
    location: String,
    country: String,
    price: Number,
    image: {
        url: String,
        filename: String
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

module.exports = mongoose.model("Listing", listingSchema);
