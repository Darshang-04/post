const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000
const { mongoUrl } = require('./keys')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require("path")

app.use(cors())
require('./models/model.js')
require('./models/post.js')
require('./models/connectionrequest.js')
app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/createPost.js'))
app.use(require('./routes/user.js'))
mongoose.connect(mongoUrl)

mongoose.connection.on("connected", ()=>{
    console.log("Successfully connected to mongodb")
})

mongoose.connection.on("Error", ()=>{
    console.log("not connected to mongodb")
})

app.use(express.static(path.join(__dirname,"./frontend/build")))
app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,'./frontend/build/index.html')),
    function (err){
        res.status(500).send(err)
    }
})

app.listen(PORT, ()=>{
    console.log("server is running on port "+ PORT)
})