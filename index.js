const express = require('express')
const { MongoClient } = require('mongodb');
const cros = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

// middleware
app.use(cros());
app.use(express.json());

// user: mydbuser1
// pass : 5t4Qgb9bg6dfGYEd


const uri = "mongodb+srv://mydbuser1:5t4Qgb9bg6dfGYEd@cluster0.lw2c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("foodMaster");
    const usersCollection = database.collection("users");
   


    // get API
    app.get('/users', async(req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await usersCollection.findOne(query);
      console.log('load user id :', id);
      res.send(user)
    })


    // post API
    app.post('/users', async (req, res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      console.log('hitting the post', req.body);
      console.log('added user', result);
      res.json(result)
    });

    // update API
    app.put('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)}
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name : updatedUser.name,
          emai : updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc, options)
      console.log('updating user', req)
      res.send(result)

    })

    // delete API
    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      console.log('deleting user with id', result);
      res.json(result);
    })


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log('Example app listening', port);
})




