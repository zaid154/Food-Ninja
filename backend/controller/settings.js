const Settings = require("../models/settings");

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ key: "store_settings" });
    if (!settings) {
      settings = await Settings.create({
        key: "store_settings",
        restaurantName: "Food Ninja",
        fssaiNumber: "10020011000123",
        gstinNumber: "07AAAAF1234A1Z5",
        storePhone: "+91 98765 43210",
        storeEmail: "support@foodninja.com",
        storeAddress: "Shop 12, Food Street, Sector 62, Delhi NCR",
        deliveryFee: 30,
        freeDeliveryThreshold: 499,
        packagingFee: 15,
        taxRate: 5,
        restaurantOpen: true,
        minOrderValue: 99,
        announcement: "Free delivery on orders above ₹499! Enjoy freshly cooked authentic meals.",
        openingTime: "06:00",
        closingTime: "20:00",
        operatingHoursText: "6:00 AM – 8:00 PM",
      });
    } else if (!settings.openingTime || !settings.closingTime || !settings.operatingHoursText) {
      settings.openingTime = settings.openingTime || "06:00";
      settings.closingTime = settings.closingTime || "20:00";
      settings.operatingHoursText = settings.operatingHoursText || "6:00 AM – 8:00 PM";
      await settings.save();
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
      restaurantName,
      fssaiNumber,
      gstinNumber,
      storePhone,
      storeEmail,
      storeAddress,
      deliveryFee,
      freeDeliveryThreshold,
      packagingFee,
      taxRate,
      restaurantOpen,
      minOrderValue,
      announcement,
      openingTime,
      closingTime,
      operatingHoursText,
    } = req.body;

    const updateData = {};
    if (restaurantName !== undefined) updateData.restaurantName = restaurantName.trim();
    if (fssaiNumber !== undefined) updateData.fssaiNumber = fssaiNumber.trim();
    if (gstinNumber !== undefined) updateData.gstinNumber = gstinNumber.trim();
    if (storePhone !== undefined) updateData.storePhone = storePhone.trim();
    if (storeEmail !== undefined) updateData.storeEmail = storeEmail.trim();
    if (storeAddress !== undefined) updateData.storeAddress = storeAddress.trim();
    if (deliveryFee !== undefined) updateData.deliveryFee = Number(deliveryFee);
    if (freeDeliveryThreshold !== undefined) updateData.freeDeliveryThreshold = Number(freeDeliveryThreshold);
    if (packagingFee !== undefined) updateData.packagingFee = Number(packagingFee);
    if (taxRate !== undefined) updateData.taxRate = Number(taxRate);
    if (restaurantOpen !== undefined) updateData.restaurantOpen = Boolean(restaurantOpen);
    if (minOrderValue !== undefined) updateData.minOrderValue = Number(minOrderValue);
    if (announcement !== undefined) updateData.announcement = announcement.trim();
    if (openingTime !== undefined) updateData.openingTime = openingTime.trim();
    if (closingTime !== undefined) updateData.closingTime = closingTime.trim();
    if (operatingHoursText !== undefined) updateData.operatingHoursText = operatingHoursText.trim();

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
