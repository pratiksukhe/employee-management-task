const Attendence = require("../models/Attendence");
const User = require("../models/User");
// @desc      create attendence
// @route     POST /api/user/create-attendence
// @access    PRIVATE

exports.createAttendence = async (req, res) => {
  try {
    const { isPresent, date } = req.body;

    if (!isPresent) {
      return res.status(400).send("Attendence record can not empty");
    }
    const attend = new Attendence({
      emp: req.user.id,
      isPresent,
      date,
    });
    const saveRecord = await attend.save();
    res.json({ msg: "your attendence saved", data: saveRecord });
  } catch (error) {
    console.error(error.megssae);
    res.status(500).send("Server error");
  }
};

// @desc      fetch attendence report
// @route     POST /api/user/attend-report
// @access    PRIVATE

exports.attendenceReport = async (req, res) => {
  const record = await Attendence.find({
    date: { $gte: req.body.date },
  });
  res.status(200).json(record);
};
