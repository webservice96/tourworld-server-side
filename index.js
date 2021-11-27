import express from 'express';
import cors from 'cors';
import mongodb from 'mongodb';
import dotenv from "dotenv";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kthq4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tour_world');
        const placeCollection = database.collection('places');
        const OrdersCollection = database.collection('booking');

        /* use POST to get data by keys */
        app.post('/newplace', async (req, res) => {
            const placeData = req.body;
            const result = await placeCollection.insertOne(placeData);
            res.json(result);
        });


        // GET API get all places
        app.get('/allplaces', async (req, res) => {
            const cursor = placeCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET API get a tour
        app.get('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const query = { "_id": mongodb.ObjectId(id) };
            const result = await placeCollection.findOne(query);
            res.send(result);
        });

        app.delete('/tour/:id', async (req, res) => {
            const id = req.params.id;
            const query = { "_id": mongodb.ObjectId(id) };
            const result = await placeCollection.deleteOne(query);
            res.json(result);
        });

        // POST api - add new booking
        app.post('/newbooking', async (req, res) => {
            const bookingData = req.body;
            const result = await OrdersCollection.insertOne(bookingData);
            res.json(result);
        });

        // GET API get all booking
        app.get('/allbooking', async (req, res) => {
            const cusrsor = OrdersCollection.find({});
            const result = await cusrsor.toArray();
            res.send(result);
        });

        // GET API get a single booking
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { "_id": mongodb.ObjectId(id) };
            const result = await OrdersCollection.findOne(query);
            res.send(result);
        });

        // GET API my booking
        app.get('/mybooking/:userId', async (req, res) => {
            const userid = req.params.userId;
            const query = { userId: userid };
            const result = await OrdersCollection.find(query).toArray();
            res.send(result);
        });

        // UPDATE API - 
        app.put('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const updateBooking = req.body;
            const query = { "_id": mongodb.ObjectId(id) };
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    status: updateBooking.status
                },
            };

            const result = await OrdersCollection.updateOne(query, updateDoc, options);
            res.json(result);
        });

        // DELETE API my booking
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { "_id": mongodb.ObjectId(id) };
            const result = await OrdersCollection.deleteOne(query);
            res.json(result);
        });

    } finally {
        // await client.close();
    }
}
run();

app.get('/', (req, res) => {
    res.send('Hello Tour World');
})

app.listen(PORT);