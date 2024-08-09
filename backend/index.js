import express from "express"
import cors from "cors"
import http from "http"
import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import dotenv from "dotenv";

import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";
import { buildContext } from "graphql-passport";

import { connectDB } from "./db/connectDB.js";
import { mergedTypeDefs } from "./typeDefs/index.js";
import { mergedResolver } from "./resolvers/index.js";
import { configurePassport } from "./passport/passport.config.js";


dotenv.config();
const app = express();
configurePassport();

const httpServer = http.createServer(app);
const MongoDBStore = connectMongo(session);

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
});

store.on("error", (err) => console.log(err));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    },
    store: store
}));


app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
    '/graphql',
    cors({
        origin: "http://localhost:3000",
        credentials: true
    }),
    express.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req , res}) => buildContext({req, res}),
    }),
  );
  
  // Modified server startup
await new Promise((resolve) => httpServer.listen({ port: 8000 }, resolve));
await connectDB();  

// const {url} = await startStandaloneServer(server, {
//     listen: 8000
// });

console.log("server is running at: 8000");