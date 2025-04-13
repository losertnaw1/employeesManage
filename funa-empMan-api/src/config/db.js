const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
        });

        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Don't exit the process, just log the error
        // process.exit(1);
    }
};

module.exports = connectDB;
