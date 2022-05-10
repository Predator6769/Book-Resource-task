const express=require('express');
const User = require('../models/auth');
const {check,validationResult}=require('express-validator');
const bcryptjs=require('bcryptjs');
const router=express.Router();
const jwt=require('jsonwebtoken');
const fetchuserdets=require('../middlewares/fetchuserdets')
const secret="whatsup";

//for creating a new account
router.post('/signin',[check('username','Enter a valid username').isLength({min:3}),check('email',"Enter a valid email").isEmail(),check('password',"Enter a valid password").isLength({min:8})],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        var fgh=errors.array();
        return res.status(400).json({errors:fgh[0].msg});
    }
    const salt=await bcryptjs.genSalt(10);
    const hashedpass=await bcryptjs.hash(req.body.password,salt);
    var b=req.body;
    b.password=hashedpass;
    const nuser=User(b);
    nuser.save((err,user)=>{
 
        if(err)
        return res.status(400).json({errors:"The credentials used already exists"});
        const data={id:nuser._id};
        const jwtdata=jwt.sign(data,secret);
        res.json({authtoken:jwtdata});
    });
});

//logging in to an existing account
router.post('/login',[check('email','enter a valid email').isEmail(),check('password','password should be of minimum 8 charecters')],async (req,res)=>{
    var valres=validationResult(req);
    if(!valres.isEmpty()){
        var g=valres.array()
    return res.status(400).json({errors:valres[0].msg});}
    User.findOne({email:req.body.email}, async (error,result)=>{
        if(result===null)
        return res.status(400).json({errors:"This user doesnt exist"});
        const comp=await bcryptjs.compare(req.body.password,result.password);
        if(!comp)
        return res.status(400).json({errors:"Incorrect password entered"});
        const data={id:result._id};
        const t=jwt.sign(data,secret);
        res.json({authtoken:t});

    });

})

//fetching a specific user's data
router.post('/userdata',fetchuserdets,async (req,res)=>{
    const data=await User.findById(req.id).select("-password");
    res.json(data);
});

module.exports=router;

