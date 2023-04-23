import { contentPath } from "../index.js";
import path from 'path';
import fs from 'fs';

export const getContent = async (req, res) => {
    //try{
        const name = req.params.name;

        const filePath = path.join(contentPath, name);
            
        if(fs.existsSync(filePath)){
            res.sendFile(filePath);
        }
        else{
            return res.status(404);
        }
    /*}catch(exception){
        res.status(500).json({message: "Something went wrong"});
    }*/
};