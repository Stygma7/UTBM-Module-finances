const mongoose = require("mongoose");

const DevisModel = mongoose.model(
    "Finance",
    {
        client: {
            type: String,
            required: true
        },
        TVA: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    "Devis",
    {
        client2: {
            type: String,
            required: true
        },
        TVA2: {
            type: Number,
            required: true
        },
        date2: {
            type: Date,
            default: Date.now
        }
    },
    "Facture"
);

module.exports = { DevisModel };