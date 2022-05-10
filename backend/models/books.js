//book data mongoose model
const mongoose=require('mongoose');
const {Schema}=mongoose;
const bookschema= new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    imageURL:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    pages:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
});

const books=mongoose.model('books',bookschema);
module.exports=books;