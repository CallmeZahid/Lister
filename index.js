const express = require('express')
require('dotenv').config();
const {connectToDB} = require('./db');
const {ApolloServer} = require('apollo-server-express');
const resolvers = require('./resolvers');
const typeDefs = require('./schema')
const getUser =  require('./utils/getUser')
const cors = require('cors');
const helmet = require('helmet')
const depthLimit = require('graphql-depth-limit')
const {createComplexityLimitRule} = require('graphql-validation-complexity')

const mongoose = require('mongoose');
const bodyParser = require('body-parser');


connectToDB();
const port = process.env.PORT || 3000;
const app = express();


app.use(cors());
app.use(helmet());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
        const token = req.headers.authorization;
        const user = getUser(token);
        return {user};
    },
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
});

app.get('/',(req,res)=>{
    res.send('Hello World');
})

server.start().then(()=>{
    server.applyMiddleware({ app, path: '/api' });
    app.listen(port,()=>{
        console.log(`server is listening at http://cart-lister.onrender.com/${server.graphqlPath}`);
    })
})

// new line

// MongoDB Connection
const uri = 'process.env.MONGO_URL'; // Replace with your URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
