const express=require('express')
const router=express.Router()
const Note=require('../models/Notes')
var fetchuser=require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');



//Route 1:get all notes of legged user using:Get:'api/notes/fetchuser'  login required 
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
    try {
    const notes=await Note.find({user:req.user.id})
    res.json(notes);
    } catch(error){
        console.error(error.message);
        //if any error occured then this code is run
        res.status(500).send("Internal error occured ")
       }
    
})

//Route 2:add  note of legged user using:POST:'api/notes/addnote'  login required 
router.post('/addnote',fetchuser,[
    body('title','enter a valide name').isLength({min:3}),
    body('description','description should be at least 5 character ').isLength({min:5}),
],async (req,res)=>{
    try {
        const{title,description,tag}=req.body;
    //if there are errors return all errors here 
   const errors=validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
   }

   const note=new Note({
    title,description,tag,user:req.user.id
   })
   const savednote=await note.save();
    res.json(savednote);
    } catch(error){
        console.error(error.message);
        //if any error occured then this code is run
        res.status(500).send("Internal error occured ")
       }
    
})

//Route 2:Update note of logged user using:put:'api/notes/updatenote'  login required

router.put('/updatenote/:id',fetchuser,async (req,res)=>{
    try {
    const{title,description,tag}=req.body;
    const newnote={}
    if(title){newnote.title=title}
    if(description){newnote.description=description}
    if(tag){newnote.tag=tag}

    //find the note to be updated and update it 
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}
    if(note.user.toString()!=req.user.id)
    {
      return res.status(401).send("not allowed")
    }
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true});
    res.json({note});
} catch(error){
    console.error(error.message);
    //if any error occured then this code is run
    res.status(500).send("Internal error occured ")
   }

})



//Route 3:Delete note of logged user using:DELETE:'api/notes/deletenote'  login required

router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
    const{title,description,tag}=req.body;
    try {
    //find the note to be deleted and delete it 
    let note=await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}
    if(note.user.toString()!=req.user.id)
    {
      return res.status(401).send("not allowed")
    }

    //allowed deletion if user owns note it
    note=await Note.findByIdAndDelete(req.params.id);
    res.json({"succes":"succesfully deleted",note:note});
} catch(error){
    console.error(error.message);
    //if any error occured then this code is run
    res.status(500).send("Internal error occured ")
   }
})
module.exports=router