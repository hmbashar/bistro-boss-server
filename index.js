const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
//middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3000;





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ukyjt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const menuCollection = client.db("Bistro").collection("Menu");
    const ReviewsCollection = client.db("Bistro").collection("Reviews");
    const CartCollection = client.db("Bistro").collection("Carts");

    
    app.get('/menu', async(req, res) => {
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    app.get('/reviews', async(req, res) => {
        const result = await ReviewsCollection.find().toArray();
        res.send(result);
    })

      //cart collection
    app.post('/carts', async(req, res) => {
      const item = req.body;
      console.log(item);
      const result = await CartCollection.insertOne(item);
      res.send(result)
    })

    //get cart collection
    app.get('/carts', async(req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const result = await CartCollection.find(query).toArray();      
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


