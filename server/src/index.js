const express = require('express');
const app = express();
const router = require('../router/auth-routes');
const connectDb = require('../utils/db');
const cors = require('cors');

app.use(express.json()); 

app.use(cors());

app.use('/api/',router); 

connectDb().then(()=>{
    const port = '5000';
    app.listen(port,()=>{
        console.log(`App listening on Port ${port}`)
    })
})