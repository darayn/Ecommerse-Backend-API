const express =  require("express")
const router = express.Router()


const {signup, login, logout, forgotPassword, passwordReset, getLoggedInUserDetails, changePassword, updateUserDetails, adminAllUser} = require("../controllers/userController")
const { isLoggedIn, customRole } = require("../middlewares/user")


// user routes
router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userdashboard').get(isLoggedIn,getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn,changePassword)
router.route('/userdashboard/update').post(isLoggedIn,updateUserDetails)

// admin routes

router.route('/admin/users').get(isLoggedIn, customRole('admin'), adminAllUser)


module.exports = router;