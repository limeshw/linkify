//todo APP NAME  - *****LINKIFY*****

import express from "express"
import {connectToMongoDB} from "./config/db.js"
import fileRoute from "./routes/files.routes.js"
import showFile from "./routes/show.routes.js"
import downloadFile from "./routes/download.routes.js"
import path from "path";
import cors from "cors"
import dotenv from "dotenv";
dotenv.config();

const app = express();
const hostname = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const allowedClients = (process.env.ALLOWED_CLIENTS || "")
  .split(",")
  .map(origin => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server / Postman
    if (!origin) return callback(null, true);

    if (allowedClients.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

// const corsOptions = {
//   origin: (process.env.ALLOWED_CLIENTS || '').split(',')
//   // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
// }
// app.use(cors(corsOptions));

connectToMongoDB(process.env.MONGO_CONNECTION_URL);

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/files" , fileRoute)
app.use("/files" , showFile)
app.use("/files/download" , downloadFile)
app.listen(PORT , () => {
    console.log(`server is running on : http://${hostname}:${PORT}`);
})