import { connectToMongoDB } from "./config/db.js";
import { File } from "./models/files.model.js";
import fs from "fs"
import dotenv from "dotenv";
dotenv.config();

connectToMongoDB(process.env.MONGO_CONNECTION_URL);

// Get all records older than 24 hours 
async function deleteData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
    }
    console.log('Job done!');
}

deleteData().then(process.exit);