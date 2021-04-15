// ================================================REQUIREMENT=====================================
const express = require("express")
const cors = require("cors")
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()
const app = express()
// =================================================MIDDLEWARE=======================================
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
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

    app.post("/addService", (req, res) => {
        const newService = req.body
        servicesCollection.insertOne(newService)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.get("/allServices", (req, res) => {
        servicesCollection.find({})
        .toArray((error, documents) => {
            res.send(documents)
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