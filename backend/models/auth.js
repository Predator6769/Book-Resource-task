//User data mongoose model
const mongoose=require('mongoose');
const {Schema}=mongoose;
const authschema= new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    books:{
        type:Array,
        required:true
    }
});
const user=mongoose.model('autherisation',authschema);

module.exports=user;