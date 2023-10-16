const app = require("./app");
const dotenv = require('dotenv');
const path = require('path');
const connectDb = require("./config/dataBase");

dotenv.config({path:path.join(__dirname, "./config/config.env") });

connectDb()

const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server listening to the port ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

//Error for mongodb connection
process.on('unhandledRejection', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to unhandled rejection error.`);
    server.close(()=>{
        process.exit(1)
    }) 

})

//Error for undefined variable
process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down due to uncaught error.`);
    server.close(()=>{
        process.exit(1)
    }) 

})

