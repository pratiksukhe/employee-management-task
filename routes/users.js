const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middlewares/isAuthenticated");
const {
  login,
  addEmployee,
  updateEmployee,
  getAllEmployee,
  viewEmployeeProfile,
  deleteEmpById,
  updateProfile,
  updatepassword,
  logout,
  birthdayWishes,
} = require("../controllers/users");

const {
  createAttendence,
  attendenceReport,
} = require("../controllers/attendence");

router.post("/login", login);
//admin
router.post("/add-employee", isAuthenticated, isAdmin, addEmployee);
router.put("/update-employee/:id", isAuthenticated, isAdmin, updateEmployee);
router.get("/all-employee", isAuthenticated, isAdmin, getAllEmployee);
router.get("/emp-profile/:id", isAuthenticated, isAdmin, viewEmployeeProfile);
router.delete("/delete-emp/:id", isAuthenticated, isAdmin, deleteEmpById);

//employee
router.get("/emp-profile/:id", isAuthenticated, viewEmployeeProfile);
router.put("/view-update", isAuthenticated, updateProfile);
router.put("/update-password", isAuthenticated, updatepassword);
router.get("/logout", logout);

//birthday
router.get("/birthday-wishes", isAuthenticated, isAdmin, birthdayWishes);

//attendence
router.post("/create-attendence", isAuthenticated, createAttendence);
router.post("/attend-report", isAuthenticated, isAdmin, attendenceReport);
module.exports = router;
