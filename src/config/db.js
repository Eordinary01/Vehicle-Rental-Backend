const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async ()=>{
    try {

        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('MongoDb Connected');
        
    } catch (err) {
        console.error(err.message);
        
    }
};

module.exports = connectDb;