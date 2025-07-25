const mongoose = require("mongoose");
const { Schema } = mongoose;

const settingsSchema = new Schema({
    shippingCost: {
        type: Number,
        required: true,
        default: 0
    },
    COD_enabled: {
        type: Boolean,
        default: false
    }
});

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
