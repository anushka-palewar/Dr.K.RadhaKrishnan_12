const router = require("express").Router();
const {protect} = require("../MiddleWare/authMiddleware");
const authController = require("../controllers/authController");


router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout",protect, authController.logoutUser);

router.get("/me",protect, authController.getMe);

module.exports = router;