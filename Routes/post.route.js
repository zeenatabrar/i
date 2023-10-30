const {Router}=require("express")
const {postModel,PostModel}=require("../Model/post.model")
const postRouter=Router()

postRouter.get("/",async(req,res)=>{
    const{pageNo,limit,minComments,maxComments,device1,device2}=req.query;
    const skip=(pageNo -1)*limit
    const {userID}=req.body
    const query={}
    if(userID){
        query.userID=userID
    }
    if(minComments && maxComments){
        query.no_of_comments={
            $and:[
                {no_of_comments:{$gt:minComments}},
                {no_of_comments:{$lt:maxComments}}
            ]
        }
    }
    if(device1 && device2){
        query.device={$and:[{device:device1},{device:device2}]}
    }else if(device1){
        query.device=device1
    }else if(device2){
        query.device=device2
    }
    try {
        const posts=await PostModel.find(query)
        .sort({no_of_comments:1})
        .skip(skip)
        .limit(limit)
        res.status(200).json({"msg":"User Posts",posts})

    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.get("/top",async(req,res)=>{
    const {pageNo}=req.query;
    const limit=3
    const skip=(pageNo-1)*limit
    try {
        const topposts=await PostModel.find()
        .sort({no_of_comments:-1})
        .skip(skip)
        .limit(limit)
        res.status(200).json({"msg":"User Posts",topposts})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.post("/add",async(req,res)=>{
    const {userID}=req.body
    try {
        const post=new postModel({...req.body,userID})
        await post.save()
        res.status(200).json({"msg":"Post was added"})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.patch("/update/:postID", async(req,res)=>{
    const {postID}=req.params
    const {userID}=req.body
    try {
        const post=await PostModel.findByIdAndUpdate(
            {userID,_id:postID},
            rq.body
        )
        if(!post){
            res.status(400).json({"msg":"Post not found"})
        }else{
            res.status(200).json({"msg":"Post Updated"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

postRouter.delete("/delete/:postID", async(req,res) => {
    const {postID} = req.params;
    const {userID} = req.body;
   try{
    const post = await postModel.findByIdAndDelete({ userID, _id: postID});
    if(!post){
        res.status(400).json({ "msg": "Post not found"})
    }else{
        res.status(200).json({ "msg": "Post deleted"})
    }
   } catch (error){
    res.status(400).json({ error : error.message})
   }
})

module.exports = {
    postRouter
}