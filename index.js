const express=require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()
const cors=require('cors')
const app=express();
const port=process.env.PORT||5000;

// middle wear
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwcqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
       await client.connect()
       const database = client.db('travel');
       const spotsCollection = database.collection("spots");
       const registerSpotcollection=database.collection("registerSpot") 

    //    get all data from sever
    app.get('/spots',async(req,res)=>{
        const cursor=spotsCollection.find({});
        const result=await cursor.toArray();
        res.send(result)
    })

 //load data using id
 app.get('/spots/:id',async(req,res)=>{
       const id=req.params.id;
       const query={_id:ObjectId(id)}
       const event=await spotsCollection.findOne(query)
       res.json(event)
});

// load data from client side
app.post('/spots',async(req,res)=>{
    const event=req.body;
    console.log(req.body)
    const result=await registerSpotcollection.insertOne(event)
    res.json(result);
});

// load registered data from database
app.get('/myorder',async(req,res)=>{
    const cursor=registerSpotcollection.find({})
    const result=await cursor.toArray()
    res.send(result);

}) 

// delete order 
app.delete('/myorder/:id',async(req,res)=>{
    const id=req.params.id;
    console.log(id)
    const query={_id:ObjectId(id)}
    const result=await registerSpotcollection.deleteOne(query)
    res.json(result)
})

// app
app.get('/myorder/:id',async(req,res)=>{
    const id=req.params.id;
       const query={_id:ObjectId(id)}
       const event=await registerSpotcollection.findOne(query)
       res.json(event)
})

    }
    finally {
        // await  client.close();
    }
   
}
run().catch(console.dir)


console.log(uri)
app.get('/',async(req,res)=>{
    console.log('travel site')
    res.send('hello traveller')
})

app.listen(port,()=>{
    console.log(port)
   
})