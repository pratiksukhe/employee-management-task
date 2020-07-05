const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc      Login user
// @route     POST /api/user/login
// @access    Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate emaail & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please provide valid email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials..!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Password doesn't match Please enter correct password..!",
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;

        res.cookie("token", token).json({ token });
      }
    );
  } catch (error) {
    console.error(error.megssae);
    res.status(500).send("Server error");
  }
};

// @desc      Add Employee
// @route     POST /api/user/add-employee
// @access    PRIVATE
exports.addEmployee = async (req, res) => {
  const { firstName, lastName, email, dob, role, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    //creating object of new user
    user = new User({
      firstName,
      lastName,
      email,
      dob,
      role,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const result = await user.save();
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc      view employee profile by id
// @route     POST /api/user/emp-profile/:id
// @access    PRIVATE
exports.viewEmployeeProfile = async (req, res) => {
  try {
    const profile = await User.findById(req.params.id);
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// @desc      update employee detail by id
// @route     POST /api/user/update/:id
// @access    PRIVATE
exports.updateEmployee = async (req, res) => {
  try {
    const emp = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          country: req.body.country,
          designation: req.body.designation,
        },
      },
      { new: true }
    );

    res.json({ "updated employee": emp });
  } catch (error) {}
};

// @desc      delete employee by id
// @route     POST /api/user/all-employee
// @access    PRIVATE
exports.deleteEmpById = (req, res) => {
  User.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      res.json({ success: true });
    })
    .catch((error) => console.log("Problem in deleting:" + error));
};

// @desc      get all employee
// @route     POST /api/user/all-employee
// @access    PRIVATE
exports.getAllEmployee = async (req, res) => {
  try {
    const allEmployee = await User.find();
    res.status(200).json({
      success: true,
      cout: allEmployee.length,
      data: allEmployee,
    });
  } catch (error) {
    console.error(error.megssae);
    res.status(500).send("Server error");
  }
};

// @desc      view and update self profile
// @route     POST /api/user/view-update
// @access    PRIVATE
exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          country: req.body.country,
          designation: req.body.designation,
        },
      },
      { new: true }
    );

    res.json({ "updated profile": updatedProfile });
  } catch (error) {
    console.error(error.megssae);
    res.status(500).send("Server error");
  }
};

// @desc      update password
// @route     PUT /api/user/update-password
// @access    PRIVATE
exports.updatepassword = async (req, res) => {
  const user = await User.findById(req.user.id);
  try {
    // Check current password
    const isMatch = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({
        msg: "Password doesn't match Please enter correct password..!",
      });
    } else {
      let newPassword = req.body.newPassword;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      //user.password = req.body.newPassword;
      const updatedPassword = await user.save();
      res.status(200).json({
        success: true,
        msg: "Password Updated Successfully",
        password: updatedPassword.password,
      });
    }
  } catch (error) {
    console.error(error.megssae);
    res.status(500).send("Server error");
  }
};

// @desc      logout user
// @route     GET /api/user/logout
// @access    PUBLIC
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};

// @desc      find birthday
// @route     PUT /api/user/birthday-wishes
// @access    PRIVATE
exports.birthdayWishes = async (req, res) => {
  var todaysDate = Date();
  const birthday = await User.find({ dob: { $eq: todaysDate } });
  res.json(birthday);
};
