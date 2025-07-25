const Settings = require("../../models/settingsSchema");

// Get settings page
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings({
                shippingCost: 0,
                COD_enabled: false
            });
            await settings.save();
        }
        res.render('Settings', { 
            settings,
            activePage: 'settings'
        });
    } catch (error) {
        console.log(error);
        res.redirect('/admin/pageerror');
    }
};

// Change COD option
const changeCODoption = async (req, res) => {
    try {
        const { COD_enabled } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({
                shippingCost: 0,
                COD_enabled: COD_enabled
            });
        } else {
            settings.COD_enabled = COD_enabled;
        }
        await settings.save();
        return res.status(200).json({ success: true, message: "COD setting updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Change shipping cost
const changeShippingCost = async (req, res) => {
    try {
        const { shippingCost } = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings({
                shippingCost: shippingCost,
                COD_enabled: false
            });
        } else {
            settings.shippingCost = shippingCost;
        }
        await settings.save();
        return res.status(200).json({ success: true, message: "Shipping cost updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getSettings,
    changeCODoption,
    changeShippingCost
};
