const express = require("express")
const {SignUp, Login, RefreshToken, HomePage, Answers, LogOut} = require("../Controllers/LoginController")
const Auth = require("../Middlewares/cookiesAuth")
const router = express.Router()

router.post("/signup", SignUp)
router.post("/login", Login)
router.post("/refreshtoken", RefreshToken)
router.get("/home", Auth, HomePage)
router.get("/answers", Auth, Answers)
router.post("/logout", Auth, LogOut)

module. exports = router