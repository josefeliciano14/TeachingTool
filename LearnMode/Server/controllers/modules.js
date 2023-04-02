import db from './../database/database.js'

import path from 'path';
import { contentPath, imagesPath } from '../index.js';
import { getFileExtension } from '../global/global.js';

export const getMyModules = async (req, res) => {
    
    const user_id = req.uid;
        
    //Check if user is authenticated
    if(!user_id){
        return res.status(401).send("Unauthenticated");
    } 
    
    try{
        let sql = "SELECT mid, name FROM modules WHERE creator=? ORDER BY date_created DESC;";
        db.query(sql, [user_id], (error, result) => {
            if(error){
                throw error;
            }

            return res.status(200).json(result);
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const createModule = async (req, res) => {
    //try{
        
        const module = JSON.parse(req.body.data);

        const user_id = req.uid;
        
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).json("Unauthenticated");
        }

        //const module = req.body;

        //Validation 
        const name = module.name ? module.name.trim() : "(No Name)";
        const description = module.description ? module.description : "";
        const is_public = module.is_public ? module.is_public : false;
        const code = module.code ? module.code.trim() : "";
        const hasImage = req?.files?.img != undefined && req?.files?.img != null;
        const modulePayload = [name, description, user_id, is_public, code, hasImage];

        const evaluationEnabled = module.evaluationEnabled ? module.evaluationEnabled : false;
        const evaluationName = module.evaluationName ? module.evaluationName : "(No Name)";
        const evaluationDescription = module.evaluationDescription ? module.evaluationDescription : "";
        const is_diagnostic = module.is_diagnostic ? module.is_diagnostic : false;

        db.query("INSERT INTO Modules(name, description, creator, is_public, code, hasImage) VALUES(?, ?, ?, ?, ?, ?);", modulePayload, (error, result) => {
            if(error){
                throw error;
            }

            const module_id = result.insertId;
            
            //Upload module image in images/modules
            if(req?.files?.img){
                const file = req.files.img;
                const fileExtension = getFileExtension(file.name);
                file.mv(path.join(imagesPath, "modules", `${module_id}.${fileExtension}`));
            }

            if(module.content){
                
                let cIndex = 0;

                //Filter out invalid content
                module.content.map((c, index) => {
                    
                    console.log(c.type);

                    //No content type is specified
                    if(!c?.type){
                        console.log("No content type specified");
                        return;
                    }

                    if(c.type === "Custom"){
                        //The content type is custom and no custom file is provided
                        if(!req.files[`c${cIndex}`]){
                            
                            console.log(`File c${cIndex} not found`);
                            return;
                        }
                        
                        //File format not supported 
                        if(getFileExtension(req.files[`c${cIndex}`].name) != "html"){
                            console.log("No html file provided");
                            return;
                        }
                    }

                    const contentName = c.name ? c.name : "";
                    const contentDescription = c.description ? c.description : "";
                    const contentData = c.data ? JSON.stringify(c.data) : "{}";

                    const contentPayload = [module_id, contentName, contentDescription, c.type, contentData, cIndex];

                    db.query("INSERT INTO DynamicContent(module, name, description, type, data, ind) VALUES(?, ?, ?, ?, ?, ?);", contentPayload, (error, result) => {
                        if(error){
                            throw error;
                        }

                        const content_id = result.insertId;
                        
                        if(req?.files && req?.files[`c${index}`]){
                            const file = req.files[`c${index}`];
                        
                            //Save file in content directory 
                            file.mv(path.join(contentPath, `${content_id}.html`));
                        }
                    });

                    cIndex++;
                });
            }

            const evaluationPayload = [module_id, evaluationName, evaluationDescription, user_id, is_diagnostic, evaluationEnabled]; 

            db.query("INSERT INTO Evaluations(module, name, description, creator, is_diagnostic, is_enabled) VALUES(?, ?, ?, ?, ?, ?);", evaluationPayload, (error, result) => {
                if(error){
                    throw error;
                }

                const evaluation_id = result.insertId;
                
                console.log(`Created Evaluation with ID: ${evaluation_id}`);

                if(module.questions){

                    let qIndex = 0;

                    module.questions.map((question, index) => {
                        
                        //If question is empty, abort 
                        if(!question.prompt){
                            return;
                        }

                        const prompt = question.prompt ? question.prompt : "";
                        const information = question.description ? question.description : "";
                        const hasImage = req?.files[`q${index}`] != undefined && req?.files[`q${index}`] != null;

                        const questionPayload = [evaluation_id, prompt, information, qIndex, hasImage];
                        
                        db.query("INSERT INTO Questions(evaluation, prompt, information, ind, hasImage) VALUES(?, ?, ?, ?, ?);", questionPayload, (error, result) => {
                            if(error){
                                throw error;
                            }

                            const question_id = result.insertId;

                            console.log(`Created Question with ID: ${question_id}`);

                            //Upload module image in images/modules
                            if(req?.files && req?.files[`q${index}`]){
                                const file = req.files[`q${index}`];
                                const fileExtension = getFileExtension(file.name);
                                file.mv(path.join(imagesPath, "questions", `${question_id}.${fileExtension}`));
                            }

                            if(question.answers){
                                
                                question.answers.map((option) => {
                                    
                                    if(option.answer && option?.answer.length > 0){ 
                                        const answer = option.answer;
                                        const is_correct = option.correct === true;
                                        const ind = option.answerIndex ? option.answerIndex : 0;
                                        
                                        const answerPayload = [question_id, answer, is_correct, ind];
                                    
                                        db.query("INSERT INTO Options(question, answer, is_correct, ind) VALUES(?, ?, ?, ?);", answerPayload, (error, result) => {
                                            if(error){
                                                throw error;
                                            }

                                            console.log(`Created Option with ID: ${module_id}`);
                                        });
                                    }
                                }); 
                            }
                        });

                        qIndex++;
                    });
                }
            });

            return res.status(201).json("Routine Added");
        });

    /*}catch (error){
        res.status(500).send("Internal Server Error");
    }*/
}