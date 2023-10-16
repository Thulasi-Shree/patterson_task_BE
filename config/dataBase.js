const mongoose = require('mongoose');


const connectDb = () => {
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then((connected) =>
            console.log(`Connected to ${connected.connection.host}!`))
        // .catch((error) => {
        //     console.log(error)
        // })
}

module.exports = connectDb