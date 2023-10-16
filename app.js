const express = require("express");
const app = express();
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')

const cors = require('cors'); 

const user = require('./routes/user')

app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use('/api/', user)





app.use(errorMiddleware)

module.exports = app