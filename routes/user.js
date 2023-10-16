const express = require("express");
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword } = require("../controllers/user");
const router = express.Router();

router.route('/user/login').post(loginUser);
router.route('/user/create').post(createUser);
router.route('/user/logout').get(logoutUser);
router.route('/user/password/reset').post(forgotPassword)
router.route('/user/password/reset/update').post(resetPassword)



module.exports = router;