const mongoose = require('mongoose');

const cached = global.__mongooseConnection || {
    connection: null,
    promise: null,
};

global.__mongooseConnection = cached;

const connectDB = async () => {
    if (cached.connection) {
        return cached.connection;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not configured');
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongooseInstance) => {
            console.log('MongoDB connected');
            return mongooseInstance;
        });
    }

    try {
        cached.connection = await cached.promise;
        return cached.connection;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
};

module.exports = connectDB;
