const mongoose=require('mongoose');


const mongooseUp=()=>{   
    require('dotenv').config(); 

    mongoose.set('strictQuery',true);        
    mongoose.connect(process.env.DBURL, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
      });
    mongoose.connection.once('open',()=>{
    console.log('connection is successfully established');
});
};

module.exports={
    mongooseUp
}