const jwt = require('jsonwebtoken')
const { jwt_secret } = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model("USER")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers;
    if (!authorization){
        return res.status(401).json({error:"plz loggin 1"})
    }
    const token = authorization.replace("Bearer ","")

    jwt.verify(token, jwt_secret, (err, payload)=>{
        if(err){
            return res.status(401).json({error:"plz loggin 2"})
        }
        const {_id}= payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()
        })
    })
}