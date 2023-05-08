const express = require('express');
const cors = require('cors');

const app = express();

require("dotenv").config();

//connect to mongodb
const dbconfig = require('./db');

//to set middlewear

app.use(cors());

//to collect request and its body
app.use(express.json());


//connect with routes
app.use('/api/auth', require('./routes/auth'));



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`without143 app listening on port ${port} and site at http://localhost:${port}`)
})