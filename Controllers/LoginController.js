const user = require("../Models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const SignUp = async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const User = await new user ({
            username: req.body.username,
            password : hash

        })
        await User.save()
        res.status(201).json({mes: 'User created'})
    } catch (error) {
        res.status(500).json({SignUpError: "This username already exists !"})
    }
}

const Login = async (req, res) => {
    try {
        const User = await user.findOne({username: req.body.username})

        if(!User){
            return res.status(401).json({WrongUsername: "Incorrect Username !"})
        }
        const checkPassword = await bcrypt.compare(req.body.password, User.password)
        if(!checkPassword){
            return res.status(401).json({WrongPassword: "Incorrect Password !"})
        }
    
        const token = jwt.sign({userInfo: User._id}, process.env.ACCESS_TOKEN, {expiresIn: "2m"})
        const refreshToken = jwt.sign({userInfo: User._id}, process.env.REFRESH_TOKEN, {expiresIn: "2d"})

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: false,
            maxAge: 2 * 60 * 1000
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            maxAge: 2 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({UserConnected: "User Connected"})
    } catch (error) {
        res.status(500).json({SignUpError: "Internal Server Error !"})
    }
}

const RefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        if(!refreshToken){
            return res.status(403).json({NeedRefreshToken: "Log in before, please !"})
        } else {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
                if(err){
                    console.log("Token Verification", err)
                } else {
                    const newToken = jwt.sign({userInfo: user._id}, process.env.ACCESS_TOKEN, {expiresIn: "2m"})
                    res.cookie("accessToken", newToken, {
                        httpOnly: true,
                        secure: false,
                        maxAge: 2 * 60 * 1000
                    })
                    res.status(200).json({TokenRefreshed: "New token sent !"})
                }
            })
        }

    } catch (error) {
        res.status(500).json({error})
    }
}

const HomePage = async(req, res) => {
    res.status(200).json({Home: "On the homepage !"})
}
const Answers = async(req, res) => {
    res.status(200).json({Answers: "On the E_Get Answers Spot !"})
}

const LogOut = async (req, res) => {
    try {

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(403).json({Mes: "No acess !"})
    }

}


module.exports = {SignUp, Login, RefreshToken, HomePage, Answers, LogOut}