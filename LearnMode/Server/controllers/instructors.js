import db from './../database/database.js'

export const getInstructors = async (req, res) => {
    try{
        const user_id = req.uid;
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT Users.uid, Instructors.iid, Sections.sid, Sections.name as section_name, Modules.name as module_name, Users.first_name, Users.last_name, permission, Modules.image, Modules.mid FROM Instructs LEFT JOIN Sections on Sections.sid = Instructs.sid LEFT JOIN Instructors ON Instructs.iid = Instructors.iid LEFT JOIN Users on Users.uid = Instructors.uid LEFT JOIN Modules on Modules.mid = Sections.module WHERE professor=? ORDER BY Sections.date_created DESC;";
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
            
        //Check if user is authenticated
        if(!user_id){
            return res.status(401).send("Unauthenticated");
        }
        
        let sql = "SELECT Instructs.iid, sid, first_name, last_name, permission, university, department FROM Instructs LEFT JOIN Instructors I on Instructs.iid = I.iid LEFT JOIN Users U on U.uid = I.uid WHERE Instructs.iid=1 AND sid=1;";
        db.query(sql, [user_id], (error, result) => {
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