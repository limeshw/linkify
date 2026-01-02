import { Router } from "express";
import multer from "multer";
import { File } from "../models/files.model.js";
import { v4 as uuidv4 } from 'uuid';
import path from "node:path";
import { sendMail } from "../services/email.services.js";
import { template } from "../services/emailTemplate.services.js";


const router = Router()

const storage = multer.diskStorage({
  destination:  (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName)
  } 
})

const upload = multer({ 
    storage: storage,
    limit : {fileSize : 100000 * 100} //100mb
 }).single("myfile");


//*routes
router.route("/").post((req,res) => {
    //store file
    upload(req,res,async(err) => {
        if(!req.file){
            return res.json({error : "All fields are required."})
        }

        if(err) return res.status(500).send({error : err.message});

        const file = new File({
            filename : req.file.filename,
            uuid : uuidv4(),
            path : req.file.path,
            size : req.file.size
        });
            
        const response = await file.save();
        return res.json({file : `${process.env.APP_BASE_URL}/files/${response.uuid}`});
    });
});

router.route("/send").post(async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).json({
            error: "All fields are required except expiry.",
        });
    }

    try {
        const file = await File.findOne({ uuid });

        if (!file) {
            return res.status(404).json({ error: "File not found." });
        }

        if (file.sender) {
            return res.status(422).json({
                error: "Email already sent.",
            });
        }

        file.sender = emailFrom;
        file.receiver = emailTo;
        await file.save();

        // Send email
        const info = await sendMail({
            to: emailTo,
            subject: "inShare - File Shared With You",
            text: `${emailFrom} shared a file with you.`,
            html: template({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + " KB",
                expires: "24 hours",
            }),
        });

        console.log(info);

        return res.json({ success: true });
    } catch (error) {  
        console.error("EMAIL ERROR 👉", error);

        return res.status(500).json({
            error: error.message || "Something went wrong",
        });
    }
});


export default router;


