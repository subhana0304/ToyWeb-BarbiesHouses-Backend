const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zmsfvx2.mongodb.net/?retryWrites=true&w=majority`;

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


    const barbiesCollection = client.db("Barbies-House").collection("Gallery");
    const addBarbieCollection = client.db("Barbies-House").collection("barbies");

    app.get('/gallery', async(req, res)=>{
        const cursor = barbiesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // addBarbie
    app.get('/barbies', async(req, res)=>{
      const cursor = addBarbieCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/barbies', async(req, res)=>{
      // console.log(query.req.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const result = await addBarbieCollection.find(query).toArray()
      res.send(result);
    })

    app.get('/barbies/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addBarbieCollection.findOne(query)
      res.send(result);
    })

    app.post('/barbies', async(req, res)=>{
      const addBarbie = req.body;
      // console.log(addBarbie);
      const result = await addBarbieCollection.insertOne(addBarbie)
      res.send(result);
    })


    app.delete('/barbies/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await addBarbieCollection.deleteOne(query)
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



app.get('/', (req, res)=>{
    res.send('Barbies House is running')
});

app.listen(port, ()=>{
    console.log(`Barbies House is running on port: ${port}`);
})