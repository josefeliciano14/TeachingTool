import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import userRoutes from './routes/users.js';
import moduleRoutes from './routes/modules.js';
import sectionRoutes from './routes/sections.js';
import instructorRoutes from './routes/instructors.js';
import imageRoutes from './routes/images.js';
import contentRoutes from './routes/content.js';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const filesPath = path.join(__dirname, "files");
export const contentPath = path.join(__dirname, "files", "content");
export const imagesPath = path.join(__dirname, "files", "images");

//Create directories if they don't exist 
if (!fs.existsSync(filesPath)){
    fs.mkdirSync(filesPath);
}
if (!fs.existsSync(contentPath)){
    fs.mkdirSync(contentPath);
}
if (!fs.existsSync(imagesPath)){
    fs.mkdirSync(imagesPath);
}
if (!fs.existsSync(path.join(imagesPath, "users"))){
    fs.mkdirSync(path.join(imagesPath, "users"));
}
if (!fs.existsSync(path.join(imagesPath, "modules"))){
    fs.mkdirSync(path.join(imagesPath, "modules"));
}
if (!fs.existsSync(path.join(imagesPath, "questions"))){
    fs.mkdirSync(path.join(imagesPath, "questions"));
}

const app = express();

app.use(bodyParser.json({limit: "30mb", extended: true, }))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true, parameterLimit: 1000000}))

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(cors());
app.use('/users', userRoutes);
app.use('/modules', moduleRoutes);
app.use('/sections', sectionRoutes);
app.use('/instructors', instructorRoutes);
app.use('/images', imageRoutes);
app.use('/content', contentRoutes);

app.listen(5000);