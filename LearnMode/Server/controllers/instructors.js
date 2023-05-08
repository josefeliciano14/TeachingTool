import db from './../database/database.js'

export const getInstructors = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT Users.uid, Instructors.iid, Sections.sid, Sections.name as section_name, Modules.name as module_name, Users.first_name, Users.last_name, Modules.image, Modules.mid FROM Instructs LEFT JOIN Sections on Sections.sid = Instructs.sid LEFT JOIN Instructors ON Instructs.iid = Instructors.iid LEFT JOIN Users on Users.uid = Instructors.uid LEFT JOIN Modules on Modules.mid = Sections.module WHERE professor=? ORDER BY Sections.date_created DESC;";
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

export const getInstructor = async (req, res) => {
    try{
        const user_id = req.uid;

        const {iid, sid} = req.params;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT Instructs.iid, Instructs.sid, first_name, last_name, permission_viewGrades, permission_removeStudents, permission_editModule, university, department, S.name as section_name, m.name as module_name, U.uid, image FROM Instructs LEFT JOIN Instructors I on Instructs.iid = I.iid LEFT JOIN Users U on U.uid = I.uid LEFT JOIN Sections S on S.sid = Instructs.sid LEFT JOIN Modules M on M.mid = S.module WHERE Instructs.iid=? AND Instructs.sid=?;";
        db.query(sql, [iid, sid], (error, result) => {
            if(error){
                throw error;
            }

            return res.status(200).json(result[0]);
        });
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const addInstructor = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const payload = req.body;
        const email = payload.user;
        const sid = payload.section;
        const permission_viewGrades = payload.permission_viewGrades === true;
        const permission_removeStudents = payload.permission_removeStudents === true;
        const permission_editModule = payload.permission_editModule === true;

        if(!email){
            throw new Error("Invalid email");
        }

        if(!sid){
            throw new Error("Invalid section");
        }

        let uid;
        let iid;
        //Check if user and instructor entry exists 
        await new Promise((resolve, reject) => {
            let sql = "SELECT Users.uid, iid FROM Users left outer join Instructors on Users.uid = Instructors.uid WHERE email=?;";
            db.query(sql, [email], (error, result) => {
                if(error){
                    throw error;
                }

                if(result.length > 0){
                    uid = result[0].uid;
                    iid = result[0].iid;
                }

                resolve();
            });    
        });

        if(!uid){
            throw new Error("User does not exist");
        }

        if(!iid){
            await new Promise((resolve, reject) => {
                let sql = "INSERT INTO Instructors(uid) VALUES(?);";
                db.query(sql, [uid], (error, result) => {
                    if(error){
                        throw error;
                    }

                    iid = result.insertId;
    
                    resolve();
                });    
            });
        }
        
        await new Promise((resolve, reject) => {
            let sql = "INSERT INTO Instructs(iid, sid, permission_viewGrades, permission_removeStudents, permission_editModule) VALUES(?, ?, ?, ?, ?);";
            db.query(sql, [iid, sid, permission_viewGrades, permission_removeStudents, permission_editModule], (error, result) => {
                if(error){
                    throw error;
                }

                resolve();
            });
        });

        return res.status(200).json({message: "OK"});;
    }
    catch(error){
        res.status(500).json({message: "Something went wrong"});
    }
}

export const updatePermissions = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {iid, sid} = req.params;

        const permissions = req.body;
        const permission_viewGrades = permissions.permission_viewGrades === true;
        const permission_removeStudents = permissions.permission_removeStudents === true;
        const permission_editModule = permissions.permission_editModule === true;
        
        let sql = "UPDATE Instructs SET permission_viewGrades=?, permission_removeStudents=?, permission_editModule=? WHERE iid=? AND sid=?;";
        db.query(sql, [permission_viewGrades, permission_removeStudents, permission_editModule, iid, sid], (error, result) => {
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

export const removeInstructor = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }

        const {iid, sid} = req.params;
        
        let sql = "DELETE FROM Instructs WHERE iid=? AND sid=?;";
        db.query(sql, [iid, sid], (error, result) => {
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