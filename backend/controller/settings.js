const Settings = require("../models/settings");

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "store_settings" });
    if (!settings) {
      settings = await Settings.create({
        key: "store_settings",
        deliveryFee: 30,
        freeDeliveryThreshold: 499,
        packagingFee: 15,
        taxRate: 5,
        restaurantOpen: true,
        minOrderValue: 99,
        announcement: "Free delivery on orders above ₹499! Enjoy freshly cooked authentic meals.",
      });
    }
    return res.status(200).json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch settings", error: error.message });
  }
};

// PUT /api/settings (Admin updates charges & settings)
const updateSettings = async (req, res) => {
  try {
    const {
      deliveryFee,
      freeDeliveryThreshold,
      packagingFee,
      taxRate,
      restaurantOpen,
      minOrderValue,
      announcement,
    } = req.body;

    const updateData = {};
    if (deliveryFee !== undefined) updateData.deliveryFee = Number(deliveryFee);
    if (freeDeliveryThreshold !== undefined) updateData.freeDeliveryThreshold = Number(freeDeliveryThreshold);
    if (packagingFee !== undefined) updateData.packagingFee = Number(packagingFee);
    if (taxRate !== undefined) updateData.taxRate = Number(taxRate);
    if (restaurantOpen !== undefined) updateData.restaurantOpen = Boolean(restaurantOpen);
    if (minOrderValue !== undefined) updateData.minOrderValue = Number(minOrderValue);
    if (announcement !== undefined) updateData.announcement = announcement.trim();

    const settings = await Settings.findOneAndUpdate(
      { key: "store_settings" },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Store charges and operational settings updated successfully!",
      settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update settings", error: error.message });
  }
};

module.exports = { getSettings, updateSettings };
