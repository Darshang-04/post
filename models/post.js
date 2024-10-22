const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    like:[{type:ObjectId, ref:"USER"}],
    comments:[{
        comment:{type:String},
        postedBy:{type:ObjectId, ref:"USER"}
    }],
    
    postedBy:{
        type: ObjectId,
        ref:"USER"
    },
},{timestamps: true})
mongoose.model("POST",postSchema);