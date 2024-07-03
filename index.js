import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import typeDefs from './schemas/employee.js';
import resolvers from './resolvers/employee.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const mongodb_uri = process.env.MONGODB_URI;

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer() {
    await server.start();
    server.applyMiddleware({ app });

    if (!mongodb_uri) {
        throw new Error('MONGODB_URI not found in environment variables');
    }

    await mongoose.connect(mongodb_uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Serve static files from the "public" directory
    app.use(express.static('public'));

    // Start the server
    app.listen(port, () =>
        console.log(`Server running at http://localhost:${port}${server.graphqlPath}`)
    );
}

startServer().catch((err) => {
    console.error('Error starting server:', err.message);
});
