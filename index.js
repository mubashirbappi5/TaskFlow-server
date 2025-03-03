const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();


app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ig6ro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const TaskDatabace = client.db("taskFlow-Db").collection("task-db");
    const UserDatabace = client.db("taskFlow-Db").collection("users-db");

   
    app.post('/users',async(req,res)=>{
      const userData = req.body
      const query = {UserEmail:userData?.UserEmail}
      const existinguser = await UserDatabace.findOne(query)
      
      if(existinguser){
        return res.send ({message:'User All ready exist'})
      }
      const result = await UserDatabace.insertOne(userData)
      res.send(result)
    })

app.get('/users',async(req,res)=>{
  const result= await UserDatabace.find().toArray()
  res.send(result)
})
app.get("/tasks/user/:UserId", async (req, res) => {
  const UserId = req.params.UserId;
  const query = { UserId: UserId }; 
  const result = await TaskDatabace.find(query).toArray();
  res.send(result);
});



app.get('/tasks/:id',async(req,res)=>{
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await TaskDatabace.findOne(query)
    res.send(result)
})

app.post('/tasks',async(req,res)=>{
    const tasks = req.body
    const result = await TaskDatabace.insertOne(tasks)
    res.send(result)
  
  })
  app.delete('/tasks/:id',async(req,res)=>{
    const id = req.params.id
    const query = { _id: new ObjectId(id) }
    const result = await TaskDatabace.deleteOne(query)
    res.send(result)
  })
  app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const updatedTask = req.body; 
    const query = { _id: new ObjectId(id) };
    const update = {
      $set: updatedTask, 
    };
    const result = await TaskDatabace.updateOne(query, update);
    res.send(result);
  });
  


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
  res.send('Hello TaskFlow!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})