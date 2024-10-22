const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const connectionRequest = new mongoose.Schema({
    sender:{
        type:ObjectId,
        ref:"USER"
    },
    receiver:{
        type:ObjectId,
        ref:"USER"
    },
    status:{
        type:String,
        enu:['pending','accepted','rejected'],
        default:'panding',
        ref:"USER"
    }
})

mongoose.model("Connectionrequest",connectionRequest)