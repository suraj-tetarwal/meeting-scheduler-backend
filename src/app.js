const express = require("express")
const userRoutes = require("./modules/user/routes/user.routes")
const meetingRoutes = require("./modules/meeting/routes/meeting.routes")
const errorHandler = require("./middlewares/errorHandler")
require("./modules/meeting/model/association")


const app = express()

app.use(express.json())

app.use("/users", userRoutes)
app.use("/meetings", meetingRoutes)

app.use(errorHandler)

module.exports = app