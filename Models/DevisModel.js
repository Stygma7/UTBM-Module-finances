const mongoose = require("mongoose");

const DevisModel = mongoose.model(
    "Finance",
    {
        client: {
            type: String,
            required: true
        },
        quantite: {
            type: Number,
            required: true
        },
        prix: {
            type: Number,
            required: true
        },
        tva: {
            type: Number,
            required: true
        },
        reduction: {
            type: Number,
            min: 0,
            required: true
        },
        totalHT: {
            type: Number,
            min: 0,
            required: true
        },
        totalTTC: {
            type: Number,
            min: 0,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        date: {
            type: Date,
            default: Date.now
        }
    },
    "Devis"
);

const FactureModel = mongoose.model(
    "Facture",
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
module.exports = { DevisModel , FactureModel };