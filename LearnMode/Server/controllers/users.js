import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from './../database/database.js'

import { SECRET_KEY } from '../middleware/auth.js'
import { imagesPath } from '../index.js'
import path from 'path';
import fs from 'fs';
import { getFileExtension } from '../global/global.js'

export const signin = async (req, res) => {
    try{
        const {email, password} = req.body;

        let sql = "SELECT * FROM Users WHERE email=?;";
        db.query(sql, [email], async (error, result) => {
            if(error){
                throw error;
            }

            if(result.length > 0){
                const passwordCorrect = await bcrypt.compare(password, result[0].password);

                if(passwordCorrect){
                    const token = jwt.sign({uid: result[0].uid, email: result[0].email}, SECRET_KEY);
    
                    return res.status(200).json({token:token});
                }
                else{
                    console.log("Password incorrect");
                    return res.status(400).json({message: "Invalid credentials"});
                }
            }
            else{
                console.log("no results");
                return res.status(400).json({message: "Invalid credentials"});
            }
        })
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const signup = async (req, res) => {
    try{
        const {email, password, first_name, last_name, picture} = req.body;

        if(email.length > 50){
            return res.status(400).json({message:"Email is too long"});
        }

        if(!first_name){
            return res.status(400).json({message:"First name cannot be null"});
        }
        
        let sql = "SELECT email FROM Users WHERE email=?";
        db.query(sql, [email], async (error, result) => {
            if(error){
                throw error;
            }
            
            if(result.length > 0){
                return res.status(400).json({message:"There is already an account associated with this email address"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            sql = "INSERT INTO Users(first_name, last_name, email, password, picture) VALUES(?, ?, ?, ?, ?)";
            db.query(sql, [first_name, last_name, email, hashedPassword, picture], (error, result) => {
                if(error){
                    throw error;
                }

                const token = jwt.sign({uid: result.insertId, email: email}, SECRET_KEY);

                return res.status(200).json({"token": token});
            });
        });

    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const getProfile = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let payload = {user: {}, instructor: {}, professor: {}};

        await new Promise((resolve, reject) => {
            let sql = "SELECT uid, first_name, last_name, email, picture FROM Users WHERE uid=?;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    payload.user = result[0];
                }

                resolve();
            });
        });

        if(!payload?.user?.uid){
            return res.status(404).json({message: "No user found"});
        }

        await new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Instructors WHERE uid=?;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    payload.instructor = result[0];
                }

                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            let sql = "SELECT * FROM Professors WHERE uid=?;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    payload.professor = result[0];
                }

                resolve();
            });
        });

        return res.status(200).json(payload);

    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const updateProfile = async (req, res) => {
    try{
        const user_id = req.uid;

        const data = req.body;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        if(data.profile === "user"){
            const first_name = data.first_name || "";
            const last_name = data.last_name || "";
            const picture = data.picture || "";

            let sql = "UPDATE Users SET first_name=?, last_name=? WHERE uid=?;";
            db.query(sql, [first_name, last_name, user_id], (error, result) => {
                if(error){
                    throw error;
                }

                //If user exists and an image was uploaded
                if(result.affectedRows > 0 && req?.files?.img){

                    //Find current picture
                    let sql = "SELECT picture FROM Users WHERE uid=?;";
                    db.query(sql, [user_id], (error, result) => {
                        if(error){
                            throw error;
                        }

                        //If there is one, delete it 
                        if(result?.length > 0){

                            fs.unlink(path.join(imagesPath, "users", `${user_id}.${result[0].picture}`), (err) => {
                                if (err) {
                                    throw err;
                                }
                            });
                        }

                        //Upload profile picture in images/users
                        const file = req.files.img;
                        const fileExtension = getFileExtension(file.name);

                        file.mv(path.join(imagesPath, "users", `${user_id}.${fileExtension}`));
                    });
                }
            });
        }
        else if(data.profile === "instructor" || data.profile === "professor"){
            const university = data.university || "";
            const department = data.department || "";

            let sql = "";
            if(data.profile === "instructor"){ 
                sql = "UPDATE Instructors SET university=?, department=? WHERE uid=?;";
            }
            else{
                sql = "UPDATE Professors SET university=?, department=? WHERE uid=?;";
            }

            db.query(sql, [university, department, user_id], (error, result) => {
                if(error){
                    throw error;
                }
            });
        }

    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const getProfilePicture = async (req, res) => {
    try{
        const uid = req.params.uid;

        let fileExtension;

        await new Promise((resolve, reject) => {
            let sql = "SELECT picture FROM Users WHERE uid=?;";
            db.query(sql, [uid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    fileExtension = result[0].picture;
                }

                resolve();
            });
        });

        if(!fileExtension){
            return res.status(404);
        }

        const filePath = path.join(imagesPath, "users", `${uid}.${fileExtension}`);
            
        if(fs.existsSync(filePath)){
            
            res.sendFile(filePath);
        }
        else{
            return res.status(404);
        }
    }catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}