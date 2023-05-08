const mongoose = require('mongoose');

// mongo url

mongoose.connect(process.env.mongoUrl,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => console.log("success connection")).catch(() => { console.log("failed connection") })


module.exports = mongoose;

