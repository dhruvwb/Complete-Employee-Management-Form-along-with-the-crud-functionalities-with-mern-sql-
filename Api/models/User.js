const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  password: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  dateOfJoining: { type: String, required: true },
  personalEmail: { type: String, required: true },
  officeEmail: { type: String, required: true },
  mobile: { type: String, required: true },
  panNo: { type: String, required: true },
  aadharNo: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
