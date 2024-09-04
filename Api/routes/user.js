const router = require("express").Router();
const User = require("../models/User");
const Address = require("../models/Address");
router.post("/register", async (req, res) => {
  const {
    name,
    password,
    gender,
    dateOfBirth,
    dateOfJoining,
    personalEmail,
    officeEmail,
    mobile,
    panNo,
    aadharNo,
  } = req.body;
  const { presentAddress, permanentAddress } = req.body.address;

  const user = new User({
    name: {
      firstName: name.firstName,
      lastName: name.lastName,
    },
    password: password,
    gender: gender,
    dateOfBirth: dateOfBirth,
    dateOfJoining: dateOfJoining,
    personalEmail: personalEmail,
    officeEmail: officeEmail,
    mobile: mobile,
    panNo: panNo,
    aadharNo: aadharNo,
  });

  const address = new Address({
    address: {
      presentAddress: {
        presentStreetNo: presentAddress.presentStreetNo,
        presentCity: presentAddress.presentCity,
        presentState: presentAddress.presentState,
        presentPinCode: presentAddress.presentPinCode,
      },
      permanentAddress: {
        permanentStreetNo: permanentAddress.permanentStreetNo,
        permanentCity: permanentAddress.permanentCity,
        permanentState: permanentAddress.permanentState,
        permanentPinCode: permanentAddress.permanentPinCode,
      },
    },
  });

  user.address = address;

  //   user.save((err, user) => {
  //     if (err) {
  //       res.status(500).send({ message: "Error creating user" });
  //     } else {
  //       res.send({ message: "User created successfully" });
  //     }
  //   });

  try {
    await user.save();
    await address.save();
    res.send({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error creating user" });
  }
});

module.exports = router;
