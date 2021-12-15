const router = require('express').Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const body = require('body-parser');
var encoder = body.urlencoded();
const mongoose = require('mongoose');
const Book = require('../models/Book');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');

router.get('/', ensureGuest ,(req, res) => {
    res.render('login')
  })

router.get("/log",ensureAuth, async(req,res)=>{
    res.render('index',{userinfo:req.user})
})

router.get("/log",ensureAuth, async(req,res)=>{
    res.render('index',{userinfo:req.user})
})

router.get("/upload",ensureAuth, async(req,res)=>{
    res.render('uploader',{flag:0})
})

// search 
router.post("/search",ensureAuth , encoder , async(req,res)=>{

    const regex = new RegExp(escapeRegex(req.body.search), 'gi');
    
    Book.find({ $text: { $search: regex } ,avail:1}).then((result)=>{
       
        res.render('search' , {result :result , tag:req.body.search});
    }).catch((err)=>{
        console.log(err);
    })

})

//////


var Storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename:(req , file , cb) => {
      cb(null , file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
  
   })
  
   var upload = multer({
     storage:Storage
   }).single('myFile');

router.post("/upload",ensureAuth , encoder , upload , async(req,res)=>{

    var book = "uploads/" + req.file.filename;
  
  var desc = req.body.desc;
  var name = req.body.name;

     new Book({
      bookName : name,
       desc:desc,
       path:book,
       userName: req.user.firstName,
       avail:0,
     }).save()
     .then((data) => {

      res.render('uploader' , {flag:1})

     })
     .catch((err) => {

      console.log(err)

     })

})



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;