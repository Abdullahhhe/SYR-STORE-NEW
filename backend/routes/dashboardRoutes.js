const express = require("express");
const router = express.Router();
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");
router.get("/user", authenticate, authorizeRoles("user"), (req, res) => {
  res.send("User Dashboard");
});
router.get(
  "/merchant",
  authenticate,
  authorizeRoles("merchant"),
  (req, res) => {
    res.send("Merchant Dashboard");
  }
);
router.get("/guest", authenticate, authorizeRoles("guest"), (req, res) => {
  res.send("Guest Dashboard");
});
module.exports = router;
