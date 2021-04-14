// ================================================REQUIREMENT=====================================
const express = require("express")
const cors = require("cors")
require("dotenv").config()
const app = express()
// =================================================MIDDLEWARE=======================================
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const port = process.env.PORT || 8000
//=====================================================ROUTES=========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING ON PORT 8000")
})
// =====================================================LISTEN========================================
app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`))