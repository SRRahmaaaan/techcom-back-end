// ================================================REQUIREMENT=====================================
const express = require("express")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()
const app = express()
// =================================================MIDDLEWARE=======================================
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(fileUpload())
const port = process.env.PORT || 8000
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.se8dl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//=====================================================ROUTES=========================================
app.get("/", (req, res) => {
    res.send("SERVER RUNNING ON PORT 8000")
})
client.connect(err => {
    const servicesCollection = client.db("servicesDb").collection("services");
    const adminCollection = client.db("adminDb").collection("admins");
    const orderCollection = client.db("adminDb").collection("admins");
    const reviewCollection = client.db("adminDb").collection("admins");

    app.post("/addService", (req, res) => {
        const file = req.files.file
        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        console.log(req.body)
        const newImg = file.data
        const encImg = newImg.toString("base64")
        const image = {
            contentType : file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, "base64")
        }
        servicesCollection.insertOne({name, description, price, image})
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.post("/addAdmin", (req, res) => {
        const newAdmin = req.body
        adminCollection.insertOne(newAdmin)
        .then(result => {
            res.send(result.insertedCount > 0 )
        })
    })

});









































// =====================================================LISTEN========================================
app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`))