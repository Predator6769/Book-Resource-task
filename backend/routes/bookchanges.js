const express = require('express');
const router = express.Router();
const Books = require('../models/books');
const User = require('../models/auth')
const { check, validationResult } = require('express-validator');
const fetchuserdets = require('../middlewares/fetchuserdets');

//creating a new book
router.post('/createbooks', [check('name', 'enter a valid name').isLength({ min: 1 }), check('imageURL', 'enter a valid url').isURL(), check('pages', 'Book should contain minimum 70 pages').isInt({ min: 70 }), check('price', 'enter a valid price').isNumeric()], fetchuserdets, async (req, res) => {
    var err = validationResult(req);
    if (!err.isEmpty()) {
        let y = err.array();
        return res.status(400).json({ errors: y[0].msg });
    }
    var id = req.id;
    var bks = Books(req.body);
    var d = await User.findById(id);
    try {
        await bks.save()
        d.books.push(bks._id);
        await d.save();
    }
    catch (err) {
        return res.status(400).json({ errors: "This book already exists" });
    }
    res.json(d);
});


//selecting a specific book using name (assuming book name is unique for every book)
router.post('/selonedb',[check('name','enter a valid name').isLength({min:1})],async (req,res)=>{
    var err=validationResult(req);
    if(!err.isEmpty()){
        let y=err.array();
        return res.status(400).json({errors:y[0].msg});
    }
    
    Books.findOne({name:req.body.name},(err,result)=>{
        if(result===null)
        return res.status(400).json({errors:"this book doesnt exists"});
        res.json(result);
    });
});


//deleting a specific book using name (assuming book name is unique for every book)
router.post('/deletebook',async (req,res)=>{
    Books.findOneAndDelete({name:req.body.name},(err,result)=>{
        if(result===null)
        return res.status(400).json({errors:"this book doesnt exist"});
        res.json(result);
    });
});

//updating a specific book using name (assuming book name is unique for every book)
router.post('/updatebook',[check('name', 'enter a valid name').isLength({ min: 1 }), check('imageURL', 'enter a valid url').isURL(), check('pages', 'Book should contain minimum 70 pages').isInt({ min: 70 }), check('price', 'enter a valid price').isNumeric()],async (req,res)=>{
    var err=validationResult(req);
    if(!err.isEmpty()){
        let y=err.array();
        return res.status(400).json({errors:y[0].msg});
    }
    Books.findOneAndUpdate({name:req.body.prevname},{name:req.body.name,imageURL:req.body.imageURL,author:req.body.author,pages:req.body.pages,price:req.body.price},(err,result)=>{
        if(result===null)
        return res.status(400).json({errors:"this book doesnt exist"});
        res.json(result)
    });
})

module.exports = router