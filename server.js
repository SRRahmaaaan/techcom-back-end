// ================================================REQUIREMENT=====================================
const express = require("express")
const cors = require("cors")
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId
require("dotenv").config()
const stripe = require("stripe")(`${process.env.STRIPE_KEY}`);
const { v4: uuidv4 } = require("uuid");
const app = express()
// =================================================MIDDLEWARE=======================================
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
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
    const ordersCollection = client.db("ordersDb").collection("orders");

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

    app.get("/specific/:id", (req, res) => {
        const id = req.params.id
        servicesCollection.find({ _id: ObjectId(id) })
        .toArray((errors, documents) => {
            res.send(documents[0])
        })
    })

    app.post("/customerOrder", (req, res) => {
        const newOrder = req.body
        ordersCollection.insertOne(newOrder)
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
//===================================================PAYMENT ROUTE===================================
app.post("/payment", (req, res) => {
    const { service, token } = req.body
    const idempotencyKey = uuidv4
    return stripe.customers.create({
        email: token.email,
        source: token.source
    })
    .then(customer => {
        stripe.charges.create({
            amount: service.price * 100,
            currency: "usd",
            customer: customer.id,
            shipping: {
                name: token.card.name,
                address: token.card.address_country
            }
        }, {idempotencyKey})
    })
    .then(result => res.status(200).json(result))
    .catch(error => console.log(error))
})







































// =====================================================LISTEN========================================
app.listen(port, () => console.log(`SERVER RUNNING ON PORT ${port}`))