import db from './../database/database.js'

export const getSections = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT sid, mid, sections.name as section_name, Modules.name as module_name, sections.date_created, image FROM sections LEFT JOIN Modules on Modules.mid = Sections.module WHERE creator=? ORDER BY modules.date_created DESC, sections.name ASC;";
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

export const getSection = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {sid} = req.params;
        
        let sql = "SELECT eid FROM Evaluations LEFT JOIN Modules M on Evaluations.module = M.mid LEFT JOIN Sections S on M.mid = S.module WHERE sid=?;"
        db.query(sql, [sid], async (error, result) => {
            if(error){
                throw error;
            }

            //As of writing this, modules are limited to one evaluation but in the future this could change 
            //If there is an evaluation in this module, get the statistics 
            if(result.length > 0){
                let payload = {
                    students: [],
                    statistics: []
                }
                
                await new Promise((resolve, reject) => {
                    let sql = "SELECT avg(score) as avg, stddev(score) as stddev, count(score >= 0) as completed, min(score) as min, max(score) as max FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL);";
                    db.query(sql, [sid, result[0].eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.statistics = result;
            
                        resolve();
                    });
                });

                await new Promise((resolve, reject) => {
                    let sql = "SELECT Sections.sid, Sections.name as section_name, Modules.name as module_name, Users.uid, Users.first_name, Users.last_name, score, date_taken, evaluation FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid LEFT JOIN Scores on Users.uid = Scores.uid WHERE Sections.sid=? AND (evaluation=? OR evaluation IS NULL) ORDER BY Users.last_name, Users.first_name ASC;";
                    db.query(sql, [sid, result[0].eid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.students = result;
            
                        resolve();
                    });
                });

                return res.status(200).json(payload);
            }
            else{
                let payload = {
                    students: []
                }

                await new Promise((resolve, reject) => {
                    let sql = "SELECT Sections.sid, Sections.name as section_name, Modules.name as module_name, Users.uid, Users.first_name, Users.last_name FROM Sections LEFT JOIN Modules on Modules.mid = Sections.module LEFT JOIN Enrollments on Sections.sid = Enrollments.sid LEFT JOIN Users on Users.uid = Enrollments.uid WHERE Sections.sid=? ORDER BY Users.last_name, Users.first_name ASC;";
                    db.query(sql, [sid], (error, result) => {
                        if(error){
                            throw error;
                        }

                        payload.students = result;
            
                        resolve();
                    });
                });

                return res.status(200).json(payload);
            }
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const createSection = async (req, res) => {
    
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let section = req.body;

        if(!section?.module){
            console.log("Missing parameter");
            
            return res.status(400).send("Missing parameter");
        }

        let allowed = false;

        await new Promise((resolve, reject) => {
            let sql = "SELECT mid, name, image FROM modules WHERE mid=? AND creator=?;";
            db.query(sql, [section.module, user_id], (error, result) => {
                if(error){
                    throw error;
                }

                allowed = result.length > 0;

                resolve();
            });
        });
        
        //User does not have permission to make a section with that module 
        if(!allowed){
            return res.status(403).send("Unauthorized");
        }

        const name = section.name || "(No Name)";
        const code = section.code || "";

        const payload = [name, user_id, section.module, code];

        await new Promise((resolve, reject) => {
            let sql = "INSERT INTO Sections(name, professor, module, code) VALUES(?, ?, ?, ?);";
            db.query(sql, payload, (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);

                resolve();
            });
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const removeStudent = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {uid, sid} = req.params;
        
        await new Promise((resolve, reject) => {
            let sql = "DELETE FROM Enrollments WHERE uid=2 AND sid=1;";
            db.query(sql, [uid, sid], (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);
            });
        });

        await new Promise((resolve, reject) => {
            let sql = "DELETE FROM Scores WHERE uid=2 AND sid=1;";
            db.query(sql, [uid, sid], (error, result) => {
                if(error){
                    throw error;
                }

                return res.status(200).json(result);
            });
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}