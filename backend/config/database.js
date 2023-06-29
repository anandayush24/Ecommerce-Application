const mongoose = require("mongoose");

//establishing database connection
const connectDatabase =()=>{
    mongoose.connect(process.env.DB_URI, {
        // useNewUrlParser: true, 
        // useUnifidTopology: true,
        // useCreateIndex: true
    }).then((data) => {
        console.log(`Mongodb connected with server ${data.connection.host}`)
    }).catch((err) => {
        console.log("error")
        console.log(err)
    })
}

module.exports = connectDatabase