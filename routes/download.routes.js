import { Router } from "express";
import { File } from "../models/files.model.js";
import cloudinary from "../config/cloudinary.js";

// import { fileURLToPath } from 'url';
// import path from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


const router = Router()

router.route("/:uuid").get(async(req,res) => {
    try {
        const file = await File.findOne({uuid : req.params.uuid});

        if(!file) return res.render('download', { error: 'Link has been expired.'});

        // const filePath = `${__dirname}/../${file.path}`;
        // const filePath = path.join(__dirname, '..', file.path);
        // res.download(filePath);

        res.redirect(file.path); // Cloudinary URL

    } catch (error) {
        res.render("download" , {error : "Something went wrong."});
    }
})

export default router;


/*
1. import { fileURLToPath } from 'url';
    Imports a Node utility function.
    Converts an ES module URL (import.meta.url) into a normal file system path.
    Needed because ES modules don’t have __filename by default.

2. const __filename = fileURLToPath(import.meta.url);
    import.meta.url → gives the current file’s location as a URL.
    fileURLToPath() → converts that URL into a real file path.
    This recreates what __filename does in CommonJS.
    example :  file:///project/routes/download.js  --> /project/routes/download.js
        
3.const __dirname = path.dirname(__filename);
    Extracts the directory name from __filename.
    Recreates __dirname behavior in ES modules.
    example : /project/routes/download.js -->  /project/routes

4. const filePath = `${__dirname}/../${file.path}`;
    Builds the absolute file path.
    __dirname → current folder (routes)
    ../ → moves one level up
    
    file.path → stored file location (probably something like uploads/file.pdf)

⚠️ Works, but path.join() is safer:
    const filePath = path.join(__dirname, '..', file.path);
*/