import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 NEW FIELDS FOR SEARCHING
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    // 🔹 Keep name for backward compatibility
    name: {
      type: String,
      required: true,
    },

    username: { 
      type: String, 
      required: true, 
      unique: true 
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

    profilePicture: {
      type: String,
      default: "",
    },

    bannerImg: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      default: "Connect In User",
    },

    location: {
      type: String,
      default: "Earth",
    },

    about: {
      type: String,
      default: "",
    },

    skills: [String],

    // 🔹 NEW PROJECT FIELD FOR SEARCHING
    projects: {
      type: String,
      default: "",
    },

    experience: [
      {
        title: String,
        company: String,
        startDate: Date,
        endDate: Date,
        description: String,
      },
    ],

    education: [
      {
        school: String,
        fieldOfStudy: Number,
        startYear: Number,
        endYear: Number,
      },
    ],

    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;