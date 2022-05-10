const express=require('express');
const connecttodb=require('./db');

connecttodb();

const app=express();
const port=5000;

app.use(express.json());


//all authentication related apis here
app.use('/auth',require('./routes/authentication'));

//all book related apis here
app.use('/bookchange',require('./routes/bookchanges'));

app.listen(port,()=>{
    console.log(`listening on port ${port}`)
});
