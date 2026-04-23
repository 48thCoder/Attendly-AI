const router = require("express").Router();
const {
  getAll,
  register,
  deleteStudent,
  getById,
} = require("../controllers/studentController");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, requireRole("teacher"), getAll);
router.get("/:id", auth, requireRole("teacher"), getById);
router.post("/register", auth, requireRole("teacher"), register);
router.delete("/:id", auth, requireRole("teacher"), deleteStudent);

module.exports = router;
