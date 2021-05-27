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
            required: false
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
        },
        date: {
            type: Date,
            default: Date.now
        },
        signe: {
            type: Boolean,
            default: false
        },
        factureExist: {
            type: Boolean,
            default: false
        }
    },
    "Devis"
);

const FactureModel = mongoose.model(
    "Facture",
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
            required: false
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
        },
        date: {
            type: Date,
            default: Date.now
        },
        paye: {
            type: Boolean,
            default: false
        }
    },
    "Facture"
);
module.exports = { DevisModel , FactureModel };