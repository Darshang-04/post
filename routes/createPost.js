const express = require('express')
const route = express.Router()
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const POST = mongoose.model("POST")


route.get("/allposts" , (req, res)=>{
    let limit = req.query.limit
    let skip = req.query.skip
    POST.find()
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name photo")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .sort('-createdAt')
    .then(posts=>res.json(posts))
    .catch(err=> console.log(err))
})

route.get('/userpost', requireLogin,(req,res)=>{
    POST.find({postedBy: req.user._id})
    .populate("postedBy", "_id name photo")
    .populate("comments.postedBy", "_id name")
    .sort('-createdAt')
    .then(userpost=>res.json(userpost))
})

route.post("/createpost" , requireLogin, (req,res)=>{
    const {title, pic} = req.body;
    if(!title || !pic){
        return res.status(422).json({error:"Post your Book"})
    }
    // console.log(req.user)
    const post = new POST({
       title,
       photo:pic,
       postedBy: req.user
    })
    post.save().then((result) => {
        return res.json({post: result})
    }).catch(err => console.log(err))

})

route.put("/likes", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $push: { like: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name photo")
        .then(update => {
            res.status(200).json( update);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        });
});

route.put("/unlikes", requireLogin, (req, res) => {
    POST.findByIdAndUpdate(req.body.postId, {
        $pull: { like: req.user._id }
    }, {
        new: true
    }).populate("postedBy", "_id name photo")
        .then(update => {
            res.status(200).json(update);
        })
        .catch(err => {
            res.status(422).json({ error: err });
        });
});

route.put('/comment',requireLogin, (req,res)=>{
    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId, {
        $push  :{comments: comment}
    },{
        new:true
    })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy",'_id name')
    .then((result) => {
        res.json({ result });
    })
    .catch(err=>{
        res.status(422).json({error: err})
    })
})

// Node.js/Express route with Mongoose
route.delete('/deletePost/:postId', requireLogin, (req, res) => {
    POST.findOne({ _id: req.params.postId })
        .populate("postedBy", "_id")
        .then(post=>{
            if(!post){
                return res.status(422).json({post:"not found"})
            }
            // console.log(post.postedBy._id, req.user._id)
            if (post.postedBy._id.toString() == req.user._id.toString()){
                post.deleteOne()
                    .then(result=>{
                        return res.json({ message : 'Successfully Deleted!!'})
                    })
                    .catch(err =>{
                        console.log({err})
                    })
                }
            })
});

route.get('/myfollowingpost',requireLogin,(req,res)=>{
    POST.find({postedBy:{$in: req.user.following}})
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(post=>{
        res.json(post)
    })
    .catch(err=>{
        console.log(err)
    })
})


module.exports = route
