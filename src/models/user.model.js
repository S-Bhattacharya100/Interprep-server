const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Defining the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpiry: Date
});

// pre("save") middleware
userSchema.pre("save", async function () {
    // Only hash if password is modified
    if(!this.isModified("password")) return;

    // Salting and Hashing the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Checks whether a password entered by an user during login matches the password stored in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);