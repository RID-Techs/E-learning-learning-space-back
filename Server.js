const express = require("express")
const app = express()
require("dotenv").config()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const loginUserRoutes = require("./Routes/LoginRoutes")
const Port = process.env.PORT || 9000
const launchDB = require("./Config/ConnectToDB")
launchDB()

app.use(cors({
    origin: 'https://e-learning-learning-space-front.onrender.com',
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/myElearning", loginUserRoutes)

app.listen(Port, () => {
    console.log("Server running on port", Port)
})
