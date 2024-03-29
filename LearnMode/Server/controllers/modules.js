import db from './../database/database.js'
import fs from 'fs';
import path from 'path';
import { contentPath, imagesPath } from '../index.js';
import { getFileExtension, supportedImgFormats } from '../global/global.js';

export const getMyModules = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        let sql = "SELECT mid, name, description, image FROM modules WHERE creator=? ORDER BY date_created DESC;";
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

export const getEnrolledModules = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        let sql = "SELECT mid, Modules.name, Modules.description, image FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Enrollments E on S.sid = E.sid WHERE E.uid=? ORDER BY enrollment_date DESC;";
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

export const getInstructingModules = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        let sql = "SELECT mid, M.name, M.description, image FROM Instructs LEFT JOIN Sections S on Instructs.sid = S.sid LEFT JOIN Modules M on M.mid = S.module LEFT JOIN Instructors I on Instructs.iid = I.iid WHERE I.uid=? ORDER BY M.date_created DESC;";
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

export const getHomeModules = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        let modules = {
            myModules: [],
            enrolled: [],
            instructing: []
        }

        //Created
        let sql1 = "SELECT mid, name, description, image FROM modules WHERE creator=? ORDER BY date_created DESC LIMIT 5;";
        await new Promise((resolve, reject) => {
            db.query(sql1, [user_id], (error, result) => {
                if(error){
                    throw error;
                }
    
                modules.created = result;

                resolve();
            }); 
        });

        //Enrolled
        let sql2 = "SELECT mid, Modules.name, Modules.description, image, S.sid as sid FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Enrollments E on S.sid = E.sid WHERE E.uid=? ORDER BY enrollment_date DESC LIMIT 5;"
        await new Promise((resolve, reject) => {
            db.query(sql2, [user_id], (error, result) => {
                if(error){
                    throw error;
                }
    
                modules.enrolled = result;

                resolve();
            });
        });

        //Instructing 
        let sql3 = "SELECT mid, M.name, M.description, image FROM Instructs LEFT JOIN Sections S on Instructs.sid = S.sid LEFT JOIN Modules M on M.mid = S.module LEFT JOIN Instructors I on Instructs.iid = I.iid WHERE I.uid=? ORDER BY M.date_created DESC LIMIT 6;"
        await new Promise((resolve, reject) => {
            db.query(sql3, [user_id], (error, result) => {
                if(error){
                    throw error;
                }
    
                modules.instructing = result;

                resolve();
            });
        });

        return res.status(200).json(modules);
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const searchModules = async (req, res) => {
    
    try{
        let query = `%${req.params.query}%`;
        
        let sql = "SELECT mid, name, description, image FROM modules WHERE name LIKE ? ORDER BY date_created DESC;";
        db.query(sql, [query], (error, result) => {
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

export const getModuleImage = async (req, res) => {
    try{
        
        const mid = req.params.mid;

        let sql = "SELECT image FROM Modules WHERE mid=?;";
        db.query(sql, [mid], (error, result) => {
            if(error){
                throw error;
            }

            if(result.length > 0 && result[0].image){
                const filePath = path.join(imagesPath, "modules", `${mid}.${result[0].image}`);

                if(fs.existsSync(filePath)){
                    res.sendFile(filePath);
                }
                else{
                    return res.status(404);
                }
            }
            else{
                return res.status(404);
            }
        });
    }
    catch{
        res.status(500).json({message: "Something went wrong"});
    }
}

export const getMyModulesLimit = async (req, res) => {
    try{
        const num = Number(req.params.limit);

        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        let sql = "SELECT mid, name, image FROM modules WHERE creator=? ORDER BY date_created DESC LIMIT ?;";
        db.query(sql, [user_id, num], (error, result) => {
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

export const getModule = async (req, res) => {
    try{
        const mid = Number(req.params.mid);
        const sid = req.query.sid

        const user_id = req.uid;

        const code = req?.query?.code;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        let role = {};
        let info = {};
        let questions = [];
        let content = [];

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, description, creator, is_public, code FROM Modules WHERE mid=?;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result.length > 0){
                    info = result[0];
                }

                resolve();
            });
        });

        //Module not found 
        if(!info?.mid){
            res.status(404).json({});
            return;
        }

        //Obtain user role 
        //A user can enter a module if they have created it, they are instructing it or if it is public
        if(info.creator === user_id){
            role = "creator";
        }
        else{
            await new Promise((resolve, reject) => {
                let sql = "SELECT * FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Instructs I on S.sid = I.sid LEFT JOIN Instructors I2 on I.iid = I2.iid WHERE Modules.mid=? AND I2.uid=?;";
                db.query(sql, [mid, user_id], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    if(result.length > 0){
                        role = "instructor";
                    }
                    else{
                        role = "student";
                    }
    
                    resolve();
                });
            });
        }
        delete info.creator;

        if(sid){
            await new Promise((resolve, reject) => {
                let sql = "SELECT * FROM Enrollments WHERE sid=? AND uid=?;";
                db.query(sql, [sid, user_id], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    if(result.length > 0){
                        role = "enrolled";
                    }
    
                    resolve();
                });
            });
        }

        //The only users allowed to enter a private module are the creator, an instructor, a user that provided the correct code or a user that is enrolled in a section using this module
        if(!info.is_public && (role != "creator" && role != "instructor" && role != "enrolled") && code != info.code){
            if(info.code){
                res.status(403).json({message: "enter code"});
                return;
            }
            else{
                res.status(403).json({});
                return;
            }
        }

        //Only get the questions if it is a creator or instructor previewing the module or if it is a student that is enrolled in a section with this module 
        //Evaluations are only for modules in the context of a section 
        if(role === "creator" || role === "instructor" || role === "enrolled"){
            await new Promise((resolve, reject) => {
                let sql = "SELECT eid, is_diagnostic, qid, prompt, information, image, oid, answer, O.ind FROM Questions LEFT JOIN Options O on Questions.qid = O.question LEFT JOIN Evaluations E on E.eid = Questions.evaluation WHERE module=? AND is_enabled=true ORDER BY eid, Questions.ind, O.ind ASC;";
                db.query(sql, [mid], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    questions = result;
    
                    resolve();
                });
            });
        }

        await new Promise((resolve, reject) => {
            let sql = "SELECT cid, name, description, type, data, ind FROM DynamicContent WHERE module=? ORDER BY ind ASC;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                content = result;

                resolve();
            });
        });

        //The database returns content data as a string so it is parsed as JSON
        content = content.map((c) => {
            c.data = JSON.parse(c.data);

            return c;
        });

        return res.status(200).json({
            role: role,
            info: info,
            questions: questions,
            content: content
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const getModuleEdit = async (req, res) => {
    try{
        const mid = Number(req.params.mid);

        const user_id = req.uid;

        const code = req?.query?.code;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        let role = {};
        let info = {};
        let questions = [];
        let content = [];
        let evaluation = {};

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, description, creator, is_public, code FROM Modules WHERE mid=?;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result.length > 0){
                    info = result[0];
                }

                resolve();
            });
        });

        //Module not found 
        if(!info?.mid){
            res.status(404).json({});
            return;
        }

        //Obtain user role 
        //A user can enter a module if they have created it, they are instructing it or if it is public
        if(info.creator === user_id){
            role = "creator";
        }
        else{
            await new Promise((resolve, reject) => {
                let sql = "SELECT * FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Instructs I on S.sid = I.sid LEFT JOIN Instructors I2 on I.iid = I2.iid WHERE Modules.mid=? AND I2.uid=?;";
                db.query(sql, [mid, user_id], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    if(result.length > 0){
                        role = "instructor";
                    }
                    else{
                        role = "student";
                    }
    
                    resolve();
                });
            });
        }
        delete info.creator;

        //The only users allowed to enter a private module are the creator, an instructor or a user that provided the correct code 
        if(!info.is_public && (role != "creator" && role != "instructor") && code != info.code){
            if(info.code){
                res.status(403).json({message: "enter code"});
                return;
            }
            else{
                res.status(403).json({});
                return;
            }
        }

        //Only get the questions if it is a creator or instructor previewing the module 
        //Evaluations are only for modules in the context of a section 
        if(role === "creator" || role === "instructor"){
            await new Promise((resolve, reject) => {
                let sql = "SELECT eid, is_diagnostic, qid, prompt, information, image, oid, answer, is_correct, O.ind FROM Questions LEFT JOIN Options O on Questions.qid = O.question LEFT JOIN Evaluations E on E.eid = Questions.evaluation WHERE module=? AND is_enabled=true ORDER BY eid, Questions.ind, O.ind ASC;";
                db.query(sql, [mid], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    questions = result;
    
                    resolve();
                });
            });
        }

        await new Promise((resolve, reject) => {
            let sql = "SELECT cid, name, description, type, data, ind FROM DynamicContent WHERE module=? ORDER BY ind ASC;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                content = result;

                resolve();
            });
        });

        //The database returns content data as a string so it is parsed as JSON
        content = content.map((c) => {
            c.data = JSON.parse(c.data);

            return c;
        });

        await new Promise((resolve, reject) => {
            let sql = "SELECT Evaluations.name, Evaluations.description, is_enabled, is_diagnostic FROM Evaluations LEFT JOIN Modules M on M.mid = Evaluations.module WHERE mid=?;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0){
                    evaluation = result[0];
                }

                resolve();
            });
        });

        return res.status(200).json({
            role: role,
            info: info,
            questions: questions,
            content: content,
            evaluation: evaluation
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

/*export const getModuleSection = async (req, res) => {
    try{
        const mid = Number(req.params.mid);

        const user_id = req.uid;
        const sid = req.sid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        let role = {};
        let info = {};
        let questions = [];
        let content = [];

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, description, creator FROM Modules WHERE mid=?;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                if(result.length > 0){
                    info = result[0];
                }

                resolve();
            });
        });

        //Module not found 
        if(!info?.mid){
            res.status(404).json({});
            return;
        }

        //Obtain user role 
        if(info.creator === user_id){
            role = "creator";
        }
        else{
            await new Promise((resolve, reject) => {
                let sql = "SELECT * FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Instructs I on S.sid = I.sid LEFT JOIN Instructors I2 on I.iid = I2.iid WHERE Modules.mid=? AND I2.uid=?;";
                db.query(sql, [mid, user_id], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    if(result.length > 0){
                        role = "instructor";
                    }
                    else{
                        role = "student";
                    }
    
                    resolve();
                });
            });
        }
        delete info.creator;

        //If the user is neither the creator nor the instructor, check to make sure they are in the section. Otherwise, reject the request. 
        if(role != "creator" && role != "instructor"){
            await new Promise((resolve, reject) => {
                let sql = "SELECT uid FROM Modules LEFT JOIN Sections S on Modules.mid = S.module LEFT JOIN Enrollments E on S.sid = E.sid WHERE mid=? AND E.uid=? AND S.sid=?;";
                db.query(sql, [mid, user_id, sid], (error, result) => {
                    if(error){
                        throw error;
                    }
    
                    if(result.length === 0){
                        res.status(403).json({});
                        return;
                    }
    
                    resolve();
                });
            });
        }

        await new Promise((resolve, reject) => {
            let sql = "SELECT eid, is_diagnostic, qid, prompt, information, image, oid, answer, O.ind FROM Questions LEFT JOIN Options O on Questions.qid = O.question LEFT JOIN Evaluations E on E.eid = Questions.evaluation WHERE module=? AND is_enabled=true ORDER BY eid, Questions.ind, O.ind ASC;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                questions = result;

                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            let sql = "SELECT cid, name, description, type, data, ind FROM DynamicContent WHERE module=? ORDER BY ind ASC;";
            db.query(sql, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                content = result;

                resolve();
            });
        });

        return res.status(200).json({
            role: role,
            info: info,
            questions: questions,
            content: content
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}*/

const allowedTypesProfessor = ["Text", "Image", "Dynamic Image", "Webpage", "Custom"];
const allowedTypes = ["Text", "Image", "Dynamic Image"];

export const createModule = async (req, res) => {
    try{
        
        const module = JSON.parse(req.body.data);

        console.log(module);

        const user_id = req.uid;
        
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).json("Unauthenticated");
        }

        let role;
        await new Promise((resolve, reject) => {
            let sql = "SELECT Users.uid >= 0 as 'user_exists', I.uid >= 0 as 'is_instructor', P.uid >= 0 as 'is_professor' FROM Users LEFT JOIN Instructors I on Users.uid = I.uid LEFT JOIN Professors P on Users.uid = P.uid WHERE Users.uid=?;";
            db.query(sql, [user_id], (error, result) => {
                if(error){
                    throw error;
                }

                if(result?.length > 0 && result[0].is_professor === 1){
                    role = "professor";
                }

                resolve();
            });
        });

        //const module = req.body;

        //Validation 
        const name = module.name ? module.name.trim() : "(No Name)";
        const description = module.description ? module.description : "";
        const is_public = module.is_public ? module.is_public : false;
        const code = module.code ? module.code.trim() : "";
        const image = req?.files?.img ? req.files.img.name : null;
        const fileExtension = getFileExtension(image);
        const modulePayload = [name, description, user_id, is_public, code, fileExtension];

        const evaluationEnabled = module.evaluationEnabled ? module.evaluationEnabled : false;
        const evaluationName = module.evaluationName ? module.evaluationName : "(No Name)";
        const evaluationDescription = module.evaluationDescription ? module.evaluationDescription : "";
        const is_diagnostic = module.is_diagnostic ? module.is_diagnostic : false;

        db.query("INSERT INTO Modules(name, description, creator, is_public, code, image) VALUES(?, ?, ?, ?, ?, ?);", modulePayload, (error, result) => {
            if(error){
                throw error;
            }

            const module_id = result.insertId;
            
            //Upload module image in images/modules
            if(req?.files?.img){
                const file = req.files.img;
                file.mv(path.join(imagesPath, "modules", `${module_id}.${fileExtension}`));
            }

            if(module.content){
                
                let cIndex = 0;

                //Filter out invalid content
                module.content.map((c, index) => {

                    //No content type is specified
                    if(!c?.type){
                        console.log("No content type specified");
                        return;
                    }

                    //Professors can upload content types that other users can't 
                    if(role === "professor"){
                        if(!allowedTypesProfessor.includes(c.type)){
                            return;
                        }
                    }
                    else{
                        if(!allowedTypes.includes(c.type)){
                            return;
                        }
                    }

                    if(c.type === "Custom"){
                        //The content type is custom and no custom file is provided
                        if(!req.files[`c${cIndex}`]){
                            
                            console.log(`File c${cIndex} not found`);
                            return;
                        }
                        
                        //File format not supported 
                        /*if(getFileExtension(req.files[`c${cIndex}`].name) != "html"){
                            console.log("No html file provided");
                            return;
                        }*/
                    }
                    else if(c.type === "Image" || c.type === "Dynamic Image"){
                        //No image file was provided
                        if(!req.files[`c${cIndex}`]){
                            
                            console.log(`File c${cIndex} not found`);
                            return;
                        }

                        //Image format not supported 
                        /*if(!supportedImgFormats.includes(getFileExtension(req.files[`c${cIndex}`].name).toLowerCase())){
                            console.log("Image format not supported");
                            return;
                        }*/
                    }

                    if(c?.file){
                        delete c.file;
                    }

                    const contentName = c.name ? c.name : "";
                    const contentDescription = c.description ? c.description : "";
                    const contentData = c.data ? JSON.stringify(c.data) : "{}";
                    const contentType = c.type;
                    let fileExtension = null;
                    if(contentType === "Custom" || contentType === "Image" || contentType === "Dynamic Image"){
                        fileExtension = getFileExtension(req.files[`c${cIndex}`].name);
                    }

                    const contentPayload = [module_id, contentName, contentDescription, contentType, contentData, cIndex];

                    db.query("INSERT INTO DynamicContent(module, name, description, type, data, ind) VALUES(?, ?, ?, ?, ?, ?);", contentPayload, (error, result) => {
                        if(error){
                            throw error;
                        }

                        const content_id = result.insertId;
                        
                        if(req?.files && req?.files[`c${index}`]){
                            const file = req.files[`c${index}`];
                        
                            //Save file in content directory 
                            file.mv(path.join(contentPath, `${content_id}.${fileExtension}`));
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

                if(module.questions){

                    let qIndex = 0;

                    module.questions.map((question, index) => {
                        
                        //If question is empty, abort 
                        if(!question.prompt){
                            return;
                        }

                        const prompt = question.prompt ? question.prompt : "";
                        const information = question.description ? question.description : "";
                        const image = req?.files[`q${index}`]?.name ? req?.files[`q${index}`]?.name : null;
                        const fileExtension = getFileExtension(image);

                        const questionPayload = [evaluation_id, prompt, information, qIndex, fileExtension];
                        
                        db.query("INSERT INTO Questions(evaluation, prompt, information, ind, image) VALUES(?, ?, ?, ?, ?);", questionPayload, (error, result) => {
                            if(error){
                                throw error;
                            }

                            const question_id = result.insertId;

                            //Upload module image in images/modules
                            if(req?.files && req?.files[`q${index}`]){
                                const file = req.files[`q${index}`];
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

    }catch (error){
        res.status(500).send("Internal Server Error");
    }
}

export const deleteModule = async (req, res) => {
    try{
        const mid = Number(req.params.mid);

        const user_id = req.uid;

        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        } 

        //Delete Dynamic Content
        let sql1 = "DELETE FROM DynamicContent WHERE module=?;";
        await new Promise((resolve, reject) => {
            db.query(sql1, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                resolve();
            }); 
        });

        //Delete Evaluation
        let sql3 = "DELETE FROM Evaluations WHERE module=?;";
        await new Promise((resolve, reject) => {
            db.query(sql3, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                resolve();
            }); 
        });

        //Delete Module
        let sql4 = "DELETE FROM Modules WHERE mid=?;";
        await new Promise((resolve, reject) => {
            db.query(sql4, [mid], (error, result) => {
                if(error){
                    throw error;
                }

                resolve();
            }); 
        });
    }catch (error){
        res.status(500).send("Internal Server Error");
    }
}