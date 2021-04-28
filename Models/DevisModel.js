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
    },
    "Devis"
)