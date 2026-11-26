const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

const stripSensitiveFields = (_doc, ret) => {
  delete ret.password;
  delete ret.__v;
  return ret;
};

userSchema.set("toJSON", { transform: stripSensitiveFields });
userSchema.set("toObject", { transform: stripSensitiveFields });

module.exports = mongoose.model("User", userSchema);
