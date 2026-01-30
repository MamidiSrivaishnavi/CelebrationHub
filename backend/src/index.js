const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/Users');
const DB_URL = 'mongodb+srv://23wh1a0526_db_user:6aOGosWY1SQxnERo@celebrationhubcluster.3t0hxo8.mongodb.net/'
const app = express()
app.listen(3000, () => {
    console.log("Server listening at port 3000");
})

const seedUserData = async () => {
    const User = [
        {
            username: 'user1',
            email: 'user1@gmail.com',
            password: 'user1',
            role: 'user1'
        },
        {
            username: 'user2',
            email: 'user2@gmail.com',
            password: 'user2',
            role: 'user2'
        },
        {
            username: 'user3',
            email: 'user3@gmail.com',
            password: 'user3',
            role: 'user3'
        },
    ]
}
app.get('/user', async(req, res) => {
    try {
        await mongoose.connect(DB_URL)
        console.log("Connection Successful")
        const listOfUsers = User.find({}).flat()
        res.status(200).json({message:"Connected to database successfully", users: listOfUsers})
    }
    catch(err) {
        console.log
    }
})
