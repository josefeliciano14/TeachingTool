import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import db from './../database/database.js'

import { SECRET_KEY } from '../middleware/auth.js'

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