const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const AttendenceSchema = new mongoose.Schema({
  emp: {
    type: ObjectId,
    ref: "users",
  },

  isPresent: {
    type: String,
    enum: ["P", "A", "L"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("attendence", AttendenceSchema);
