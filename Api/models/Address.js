const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  address: {
    presentAddress: {
      presentStreetNo: { type: String, required: true },
      presentCity: { type: String, required: true },
      presentState: { type: String, required: true },
      presentPinCode: { type: String, required: true },
    },
    permanentAddress: {
      permanentStreetNo: { type: String, required: true },
      permanentCity: { type: String, required: true },
      permanentState: { type: String, required: true },
      permanentPinCode: { type: String, required: true },
    },
  },
});

module.exports = mongoose.model("Address", AddressSchema);
