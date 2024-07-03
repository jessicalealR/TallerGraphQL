// connectDB.js

import mongoose from 'mongoose';

const uri = 'mongodb+srv://jessicaleal01:KcqSNKFyZlWgwA2z@empleados.sfc5re2.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

export default connectDB;
