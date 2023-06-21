const mongoose=require('mongoose');


const mongooseUp=()=>{   
    require('dotenv').config(); 

    mongoose.set('strictQuery',false);        
    mongoose.connect(process.env.DBURL);
    mongoose.connection.once('open',()=>{
    console.log('connection is successfully established');
});
};

module.exports={
    mongooseUp
}