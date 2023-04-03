import { contentPath } from "../index.js";
import path from 'path';
import fs from 'fs';

export const getContent = async (req, res) => {
    //try{
        const cid = req.params.cid;

        const filePath = path.join(contentPath, `${cid}.html`);
            
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